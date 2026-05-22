import type { Access, AccessArgs, PayloadRequest } from 'payload'

export type BackendPermissionAction = 'read' | 'create' | 'update' | 'delete'

export const backendPermissionTargets = [
  { label: 'Users', value: 'users' },
  { label: 'Backend Roles', value: 'backend-roles' },
  { label: 'Specialties', value: 'specialties' },
  { label: 'Doctors', value: 'doctors' },
  { label: 'Certificates', value: 'certificates' },
  { label: 'Facilities', value: 'facilities' },
  { label: 'Institutions', value: 'institutions' },
  { label: 'Leads', value: 'leads' },
  { label: 'Lead Files', value: 'lead-files' },
  { label: 'Procedures', value: 'procedures' },
  { label: 'Doctors Media', value: 'doctors-media' },
  { label: 'Facilities Media', value: 'facilities-media' },
  { label: 'Institutions Media', value: 'institutions-media' },
  { label: 'Certificates Media', value: 'certificates-media' },
  { label: 'Procedures Media', value: 'procedures-media' },
  { label: 'Global Media', value: 'medical-assets' },
  { label: 'Site Settings', value: 'site-settings' },
  { label: 'Patient Journey', value: 'patient-journey' },
  { label: 'Why Queretaro', value: 'why-queretaro' },
] as const

type BackendRoleLike = {
  isActive?: boolean | null
  permissions?: Array<{
    target?: string | null
    read?: boolean | null
    create?: boolean | null
    update?: boolean | null
    delete?: boolean | null
  }> | null
}

const getUser = (req: PayloadRequest) => req.user as any

export const isPrincipalAdminUser = (user: any) => {
  return Boolean(user?.roles?.includes('admin'))
}

export const isPrincipalAdmin: Access = ({ req }) => isPrincipalAdminUser(getUser(req))

export const isPrincipalAdminField = ({ req }: { req: PayloadRequest }) =>
  isPrincipalAdminUser(getUser(req))

const getRoleIDs = (roles: unknown): Array<number | string> => {
  if (!Array.isArray(roles)) return []

  return roles
    .map((role) => {
      if (typeof role === 'number' || typeof role === 'string') return role
      if (role && typeof role === 'object' && 'id' in role) return (role as { id: number | string }).id
      return null
    })
    .filter((role): role is number | string => role !== null)
}

const getPopulatedRoles = (roles: unknown): BackendRoleLike[] => {
  if (!Array.isArray(roles)) return []
  return roles.filter((role): role is BackendRoleLike => {
    return Boolean(role && typeof role === 'object' && 'permissions' in role)
  })
}

export const hasBackendPermission = async (
  req: PayloadRequest,
  target: string,
  action: BackendPermissionAction
) => {
  const user = getUser(req)

  if (!user) return false
  if (isPrincipalAdminUser(user)) return true

  let roles = getPopulatedRoles(user.backendRoles)

  if (roles.length === 0) {
    const roleIDs = getRoleIDs(user.backendRoles)

    if (roleIDs.length > 0) {
      const result = await req.payload.find({
        collection: 'backend-roles',
        depth: 0,
        limit: 100,
        overrideAccess: true,
        where: {
          id: { in: roleIDs },
        },
      })

      roles = result.docs as BackendRoleLike[]
    }
  }

  return roles.some((role) => {
    if (role.isActive === false) return false

    return role.permissions?.some((permission) => {
      return permission.target === target && permission[action] === true
    })
  })
}

export const backendAccess =
  (target: string, action: BackendPermissionAction): Access =>
  async ({ req }: AccessArgs) => {
    return hasBackendPermission(req, target, action)
  }

export const authenticated: Access = ({ req }) => Boolean(req.user)
