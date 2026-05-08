import 'dotenv/config'
import crypto from 'node:crypto'
import pg from 'pg'

const { Client } = pg

const doctorId = 1
const specialtyId = 3

const text = (value, format = 0) => ({
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  type: 'text',
  version: 1,
})

const paragraph = (...children) => ({
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1,
  textFormat: 0,
  textStyle: '',
})

const heading = (tag, value) => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'heading',
  version: 1,
  tag,
})

const listItem = (value) => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'listitem',
  version: 1,
  value: 1,
})

const bulletList = (items) => ({
  children: items.map(listItem),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'list',
  version: 1,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
})

const richText = ({ overview, candidates, whyQueretaro, recovery }) => ({
  root: {
    children: [
      heading('h2', 'A focused spine treatment pathway in Queretaro'),
      paragraph(text(overview)),
      heading('h3', 'Who may be a candidate?'),
      paragraph(text(candidates)),
      heading('h3', 'Why consider Queretaro for this procedure?'),
      paragraph(text(whyQueretaro)),
      heading('h3', 'Recovery planning for international patients'),
      paragraph(text(recovery)),
      heading('h3', 'What patients should bring to the first review'),
      bulletList([
        'Recent MRI, CT scan, X-rays or written radiology reports when available.',
        'A short timeline of symptoms, prior injections, therapy, medications and previous surgeries.',
        'A list of current medications, allergies and relevant medical conditions.',
        'Clear goals for the consultation, including pain relief, mobility, return to work and travel timing.',
      ]),
      paragraph(
        text(
          'This page is for educational planning only and does not replace a diagnosis, emergency evaluation or an individual recommendation from a spine specialist.'
        )
      ),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const procedures = [
  {
    name: 'Minimally Invasive Spine Surgery in Queretaro',
    slug: 'minimally-invasive-spine-surgery-queretaro',
    shortSummary:
      'Smaller-incision spine surgery in Queretaro for selected disc, stenosis and stability problems, planned for US patients seeking advanced care in Mexico.',
    recoveryTime: 'Varies by procedure; many decompressions are days to weeks, while fusions can take several months',
    surgeryDuration: 'Usually 1 to 4 hours depending on diagnosis and levels treated',
    anesthesiaType: 'general',
    content: {
      overview:
        'Minimally invasive spine surgery uses smaller access corridors and specialized visualization to treat selected spine problems while reducing disruption to muscles and soft tissues. It may be used for decompression, discectomy or fusion depending on the exact diagnosis.',
      candidates:
        'Candidates are typically patients whose symptoms match a specific structural problem on imaging, such as a herniated disc, spinal stenosis or instability, and whose pain, weakness or function has not improved enough with nonsurgical care.',
      whyQueretaro:
        'Queretaro offers modern private hospital infrastructure, a calmer recovery environment than many border destinations and bilingual coordination for patients traveling from the United States.',
      recovery:
        'Recovery depends on whether the procedure is a decompression, endoscopic approach or fusion. The patient journey should include medical clearance, hotel planning, walking instructions and a safe return-travel window.',
    },
    faqs: [
      ['Is minimally invasive spine surgery always better than open surgery?', 'Not always. The best approach depends on the diagnosis, anatomy, number of levels, instability and the surgeon’s evaluation. Minimally invasive techniques can reduce soft-tissue disruption in selected cases.'],
      ['Can US patients travel for minimally invasive spine surgery?', 'Many patients can travel for planned spine care, but timing depends on medical risk, procedure type, follow-up needs and whether the patient has a safe recovery plan in place.'],
      ['What records are needed before traveling?', 'Recent MRI or CT images, radiology reports, medication lists and a clear symptom history help the surgeon determine whether a remote review or in-person evaluation is appropriate.'],
      ['Will I need physical therapy after surgery?', 'Many patients benefit from guided rehabilitation, but the schedule depends on the procedure and the surgeon’s postoperative instructions.'],
    ],
  },
  {
    name: 'Endoscopic Spine Surgery in Queretaro',
    slug: 'endoscopic-spine-surgery-queretaro',
    shortSummary:
      'Advanced endoscopic spine surgery in Queretaro for selected herniated discs, stenosis and nerve compression with bilingual planning for international patients.',
    recoveryTime: 'Often faster than traditional open procedures, but varies by diagnosis and technique',
    surgeryDuration: 'Often 1 to 2.5 hours depending on level and complexity',
    anesthesiaType: 'general',
    content: {
      overview:
        'Endoscopic spine surgery is a minimally invasive technique that uses a small camera and specialized instruments to access the affected area through very small incisions. It is commonly considered for selected disc herniations, stenosis and nerve compression patterns.',
      candidates:
        'A patient may be a candidate when symptoms such as leg pain, numbness, weakness or walking limitation correlate with imaging and when conservative care has not provided enough improvement.',
      whyQueretaro:
        'Dr. Larrinua’s public profile highlights training in uniportal and biportal endoscopic spine techniques, including training in Germany and South Korea. Queretaro adds the recovery advantage of a modern, well-connected city with less friction for patients and companions.',
      recovery:
        'Patients need a plan for early walking, wound care, medication instructions, warning signs and follow-up. Bilingual coordination is especially important because small-incision surgery still requires precise postoperative understanding.',
    },
    faqs: [
      ['What conditions can endoscopic spine surgery treat?', 'It may be used in selected cases of herniated disc, sciatica, spinal stenosis or foraminal narrowing, depending on imaging and clinical findings.'],
      ['How large are the incisions?', 'Endoscopic techniques generally use very small incisions, but the exact approach depends on the technique and the patient’s anatomy.'],
      ['Is endoscopic spine surgery outpatient?', 'Some cases may allow short-stay or outpatient-style recovery, while others require hospital observation. The decision depends on procedure complexity and patient risk.'],
      ['Is it safe to fly after endoscopic spine surgery?', 'Return travel must be cleared by the surgeon. Timing depends on pain control, mobility, clot-risk assessment and the specific procedure performed.'],
    ],
  },
  {
    name: 'Pediatric Scoliosis Treatment in Queretaro',
    slug: 'pediatric-scoliosis-treatment-queretaro',
    shortSummary:
      'Scoliosis evaluation and surgical planning in Queretaro for children and teens, with family-centered bilingual guidance for international patients.',
    recoveryTime: 'Observation and bracing vary; surgical recovery often spans weeks to months',
    surgeryDuration: 'Surgical cases vary widely by curve severity and planned correction',
    anesthesiaType: 'general',
    content: {
      overview:
        'Pediatric scoliosis treatment starts with understanding curve size, location, growth remaining and progression risk. Options may include observation, bracing or surgery when curves are severe or progressing.',
      candidates:
        'Children and teenagers may need specialist evaluation when a curve is progressing, bracing is being considered, pain or imbalance is present, or imaging suggests a severe curve that could require surgical correction.',
      whyQueretaro:
        'For families traveling from the United States, Queretaro offers access to private specialty care, a structured patient journey and a city environment where parents can stay comfortably while planning evaluation or recovery.',
      recovery:
        'Family logistics matter: school timing, caregiver support, hotel access, mobility, wound care and communication with the care team should be planned before travel.',
    },
    faqs: [
      ['Does every child with scoliosis need surgery?', 'No. Many children are monitored or treated with bracing depending on curve size, growth remaining and progression risk. Surgery is generally reserved for more severe or progressive curves.'],
      ['What imaging is useful for scoliosis evaluation?', 'Standing spine X-rays are commonly used to measure curve severity. Additional imaging may be requested depending on symptoms and the specialist’s evaluation.'],
      ['Can families from the US coordinate a second opinion?', 'Yes, a structured review can help families understand whether observation, bracing or surgical planning should be discussed.'],
      ['How long is recovery after scoliosis surgery?', 'Recovery varies, but many families should plan for weeks of early recovery and several months before unrestricted activity, depending on the surgeon’s instructions.'],
    ],
  },
  {
    name: 'Adult Spinal Deformity Treatment in Queretaro',
    slug: 'adult-spinal-deformity-treatment-queretaro',
    shortSummary:
      'Adult spinal deformity and degenerative scoliosis evaluation in Queretaro for US patients seeking clear options for pain, posture and mobility.',
    recoveryTime: 'Nonsurgical care varies; major reconstructive procedures can require months of recovery',
    surgeryDuration: 'Highly variable depending on complexity and number of spinal levels',
    anesthesiaType: 'general',
    content: {
      overview:
        'Adult spinal deformity includes conditions such as degenerative scoliosis, imbalance, kyphosis and age-related changes that affect posture, walking tolerance and nerve function. Treatment may be nonsurgical or surgical depending on severity.',
      candidates:
        'Patients often seek evaluation when they have progressive posture changes, back and leg pain, walking limitation, nerve compression symptoms or imaging that shows scoliosis, stenosis or instability.',
      whyQueretaro:
        'Complex spine decisions require time, clarity and trust. Queretaro gives international patients a sophisticated care environment with practical recovery zones such as Centro Sur and calmer options for later recovery.',
      recovery:
        'Adult deformity care may require staged planning, medical optimization and careful recovery support. International patients should expect a detailed review of risk, goals, travel timing and follow-up needs.',
    },
    faqs: [
      ['Is adult spinal deformity the same as scoliosis?', 'Adult spinal deformity can include scoliosis, but it may also involve forward stooping, kyphosis, imbalance, stenosis or instability.'],
      ['Can adult scoliosis be treated without surgery?', 'Many patients start with nonsurgical care such as physical therapy, medication, injections or activity modification. Surgery is considered when symptoms and structural problems justify it.'],
      ['Why is imaging so important?', 'Standing X-rays, MRI or CT scans help the surgeon understand alignment, nerve compression, degeneration and the number of levels involved.'],
      ['Is this a good procedure for medical tourism?', 'It can be planned internationally in selected cases, but complex deformity surgery requires careful risk assessment, recovery time and follow-up planning.'],
    ],
  },
  {
    name: 'Spinal Fracture Treatment in Queretaro',
    slug: 'spinal-fracture-treatment-queretaro',
    shortSummary:
      'Spinal fracture evaluation and treatment in Queretaro for traumatic and compression fractures, with bilingual guidance for international patients.',
    recoveryTime: 'Often weeks to months depending on fracture type, stability and treatment plan',
    surgeryDuration: 'Varies from nonoperative management to complex stabilization procedures',
    anesthesiaType: 'general',
    content: {
      overview:
        'Spinal fractures range from stable compression fractures to unstable injuries that may threaten spinal alignment or nerve function. Treatment depends on fracture pattern, stability, neurologic findings and bone quality.',
      candidates:
        'A specialist review is important after trauma, sudden severe back pain, known osteoporosis, loss of height, deformity, numbness, weakness or imaging that shows a vertebral fracture.',
      whyQueretaro:
        'Queretaro is well suited for patients who need private evaluation, imaging review, stabilization planning and a recovery environment that can support both the patient and companion.',
      recovery:
        'Recovery planning may include bracing, mobility precautions, pain control, osteoporosis assessment, wound care if surgery is required and clear instructions before return travel.',
    },
    faqs: [
      ['Do all spinal fractures need surgery?', 'No. Stable fractures may be treated with medication, bracing and activity modification. Unstable fractures or fractures with nerve compression may require surgery.'],
      ['What symptoms are urgent?', 'Weakness, numbness, bowel or bladder changes, severe trauma or rapidly worsening pain should be evaluated urgently.'],
      ['Can osteoporosis cause spinal fractures?', 'Yes. Vertebral compression fractures can occur in people with weakened bones, sometimes after minor movements or low-energy falls.'],
      ['What records help with planning?', 'X-rays, CT scans, MRI reports, bone density testing and medication history are useful for determining stability and treatment options.'],
    ],
  },
  {
    name: 'Sciatica Treatment in Queretaro',
    slug: 'sciatica-treatment-queretaro',
    shortSummary:
      'Sciatica diagnosis and treatment in Queretaro for leg pain from nerve compression, including nonsurgical care and selected surgical options.',
    recoveryTime: 'Many cases improve over weeks; surgical recovery depends on the cause and procedure',
    surgeryDuration: 'Surgical decompression often ranges from 1 to 2.5 hours when indicated',
    anesthesiaType: 'general',
    content: {
      overview:
        'Sciatica is nerve pain that travels from the lower back or buttock into the leg. It is a symptom rather than a single diagnosis, commonly related to a herniated disc, spinal stenosis or another source of nerve compression.',
      candidates:
        'Patients should seek specialist review when leg pain is severe, persistent, recurrent, associated with numbness or weakness, or when symptoms have not improved with appropriate nonsurgical care.',
      whyQueretaro:
        'For US patients, Queretaro can provide a focused spine evaluation, imaging review and bilingual coordination for conservative care, injections or surgical decompression when appropriate.',
      recovery:
        'The recovery plan depends on the cause of sciatica. Patients traveling for care need clear medication instructions, walking guidelines and a safe travel plan after treatment.',
    },
    faqs: [
      ['Is sciatica a diagnosis?', 'Sciatica describes nerve pain down the leg. The actual diagnosis is the cause of nerve irritation, such as a herniated disc or spinal stenosis.'],
      ['Does sciatica always require surgery?', 'No. Many cases improve with time, medication, physical therapy or injections. Surgery may be considered for persistent disabling pain or neurologic symptoms.'],
      ['What symptoms should not wait?', 'New weakness, loss of bowel or bladder control, numbness in the groin area or severe rapidly worsening symptoms require urgent medical evaluation.'],
      ['Can minimally invasive surgery help sciatica?', 'In selected patients, minimally invasive decompression or discectomy may relieve pressure on the affected nerve. Imaging and examination determine whether this is appropriate.'],
    ],
  },
]

const client = new Client({ connectionString: process.env.DATABASE_URI })

await client.connect()

try {
  await client.query('begin')

  for (const procedure of procedures) {
    const result = await client.query(
      `
        insert into procedures (
          name,
          slug,
          specialty_id,
          short_summary,
          full_description,
          pricing_starting_price_u_s_d,
          pricing_financing_available,
          recovery_time,
          surgery_duration,
          anesthesia_type,
          is_active,
          updated_at,
          created_at
        )
        values ($1, $2, $3, $4, $5::jsonb, 0, true, $6, $7, $8, true, now(), now())
        on conflict (slug) do update set
          name = excluded.name,
          specialty_id = excluded.specialty_id,
          short_summary = excluded.short_summary,
          full_description = excluded.full_description,
          recovery_time = excluded.recovery_time,
          surgery_duration = excluded.surgery_duration,
          anesthesia_type = excluded.anesthesia_type,
          is_active = true,
          updated_at = now()
        returning id
      `,
      [
        procedure.name,
        procedure.slug,
        specialtyId,
        procedure.shortSummary,
        JSON.stringify(richText(procedure.content)),
        procedure.recoveryTime,
        procedure.surgeryDuration,
        procedure.anesthesiaType,
      ]
    )

    const procedureId = result.rows[0].id

    await client.query('delete from procedures_faqs where _parent_id = $1', [procedureId])

    for (const [index, [question, answer]] of procedure.faqs.entries()) {
      await client.query(
        `
          insert into procedures_faqs (_order, _parent_id, id, question, answer)
          values ($1, $2, $3, $4, $5)
        `,
        [index, procedureId, crypto.randomUUID(), question, answer]
      )
    }

    await client.query(
      `
        insert into doctors_rels ("order", parent_id, path, procedures_id)
        select $1, $2, 'procedures', $3
        where not exists (
          select 1 from doctors_rels
          where parent_id = $2 and path = 'procedures' and procedures_id = $3
        )
      `,
      [procedureId, doctorId, procedureId]
    )

    console.log(`upserted ${procedure.name}`)
  }

  await client.query('commit')
} catch (error) {
  await client.query('rollback')
  throw error
} finally {
  await client.end()
}
