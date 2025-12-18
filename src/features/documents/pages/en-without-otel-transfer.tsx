import { useAuth } from '@/providers/auth'
import { EditableContainer } from '../components/editable-container'
import { EditableHide } from '../components/editable-hide'
import { EditableLink } from '../components/editable-link'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { EditorMenu } from '../components/menu-editor'
import { useField } from '../hooks/use-field'
import { SquareBullet } from '../components/icon-square'

export const WithoutOtelTransferPageEN = () => {
  const { user } = useAuth()

  const formData = [
    // --- PAGE : 1 ---
    {
      name: 'Client Name',
      editKey: 'p1-customer-name',
      defaultValue: 'Mr. Breuer',
      inputMode: 'text',
    },
    {
      name: 'Procedure Date',
      editKey: 'p1-proc-date-main',
      defaultValue: 'Friday, 27 March 2026',
      inputMode: 'text',
    },
    {
      name: 'Day 1: Date',
      editKey: 'p1-day1-date',
      defaultValue: 'Thursday, 26 March 2026',
      inputMode: 'text',
    },
    {
      name: 'Day 1: Instruction',
      editKey: 'p1-day1-text',
      defaultValue: `You will receive a message regarding your exact arrival time one day prior to your appointment. Please proceed to our clinic at the confirmed time. The flow of the day will be as follows:`,
      inputMode: 'textarea',
    },
    // --- PAGE : 2 ---
    {
      name: 'Day 2: Date',
      editKey: 'p2-day2-date',
      defaultValue: '( Friday, 27 March 2026 )',
      inputMode: 'text',
    },
    {
      name: 'Day 3: Date',
      editKey: 'p2-day3-date',
      defaultValue: '( Saturday, 28 March 2026 )',
      inputMode: 'text',
    },
    // --- PAGE : 3 ---
    {
      name: 'Total Package Value',
      editKey: 'p3-finance-total-val',
      defaultValue: '€2,000',
      inputMode: 'text',
    },
    {
      name: 'Hide Total',
      editKey: 'p3-finance-total-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Deposit Amount',
      editKey: 'p3-finance-deposit-val',
      defaultValue: '€500 (Non-refundable)',
      inputMode: 'text',
    },
    {
      name: 'Hide Deposit',
      editKey: 'p3-finance-deposit-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Outstanding Balance',
      editKey: 'p3-finance-balance-val',
      defaultValue: '€1,500',
      inputMode: 'text',
    },
    {
      name: 'Hide Balance',
      editKey: 'p3-finance-balance-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Due Date Info',
      editKey: 'p3-finance-duedate-val',
      defaultValue: 'In full on the day of the procedure.',
      inputMode: 'text',
    },
    {
      name: 'Hide Due Date',
      editKey: 'p3-finance-duedate-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    // --- PAGE : 4 ---
    {
      name: 'Representative Name',
      editKey: 'p4-rep-name',
      defaultValue: 'Ergun Meylani',
      seedValue: user?.name,
      inputMode: 'text',
    },
    {
      name: 'Representative Phone',
      editKey: 'p4-rep-phone',
      defaultValue: {
        value: '+90 532 650 51 51',
        type: 'tel',
      },
      seedValue: user?.phone
        ? {
            value: user.phone,
            type: 'tel',
          }
        : undefined,
      inputMode: 'link',
    },
  ] as const satisfies FornModeInputConfig[]

  const f = useField(formData)

  return (
    <main className="flex flex-col bg-stone-50 text-[14px] leading-tight text-black md:items-center md:justify-center">
      <EditorMenu formData={formData} />

      {/* --- PAGE 1 --- */}
      <EditablePage index={0}>
        <article className="flex flex-col gap-y-6">
          <section className="flex flex-col gap-y-2">
            <h1 className="font-bold text-black">
              Dear <EditableText field={f('p1-customer-name')} />,
            </h1>
            <p className="text-justify">
              We hope this message finds you well. On behalf of the entire team at Hair of Istanbul,
              we are delighted to formally confirm your scheduled hair transplant procedure for{' '}
              <EditableText field={f('p1-proc-date-main')} className="font-bold" />. This document
              serves as your comprehensive appointment confirmation and guide. To ensure a seamless
              and successful experience, we kindly ask you to review the following information
              carefully.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary">
              <span className="font-bold">1. CRITICAL MEDICAL INFORMATION</span>
              <span className="block">& DISCLOSURES</span>
            </h2>

            <div className="flex flex-col gap-y-5">
              {/* Item 1 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Pre-Procedure Screening
                </h3>
                <p>
                  We will conduct mandatory HIV and Hepatitis B/C blood tests at our clinic on the
                  day of your procedure. A positive result for either condition will regrettably
                  prevent us from performing the procedure.
                </p>
              </div>

              {/* Item 2 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Procedure Contraindications:
                </h3>
                <p>
                  If you have a history of Epilepsy, keloid scarring, psoriasis, folliculitis
                  (anywhere on your body), or Diabetes,{' '}
                  <span className="font-bold text-black">
                    please contact your customer representative at your earliest convenience.
                  </span>{' '}
                  These conditions require a specific medical review and may prevent us from
                  proceeding.
                </p>
              </div>

              {/* Item 3 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Required Medical Disclosure:
                </h3>
                <p className="mb-2">
                  You are required to inform your dedicated customer representative via WhatsApp if
                  you have any other chronic medical conditions, such as:
                </p>
                <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                  <li>Heart disease</li>
                  <li>High blood pressure</li>
                  <li>Eczema or seborrheic dermatitis</li>
                  <li>
                    Or if you are taking any regular prescription or over-the-counter medications.
                  </li>
                </ul>
              </div>

              {/* Item 4 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Potential Postponement:
                </h3>
                <p>
                  If active eczema or seborrheic dermatitis is present in the donor or recipient
                  areas, the procedure may need to be postponed by 3–5 days to allow the skin to
                  heal fully. In such cases, you would be responsible for all associated costs
                  related to rescheduling your flight and extending your hotel stay.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">2. YOUR APPOINTMENT</span>
              <span className="block">SCHEDULE AND ITINERARY</span>
            </h2>

            <div className="flex flex-col gap-y-6">
              {/* Day 1: Procedure Day */}
              <div>
                <h3 className="mb-2 text-[16px] text-black">
                  <span className="font-bold">Day 1: Procedure Day </span>
                  ( <EditableText field={f('p1-day1-date')} className="font-custom-commuters" /> )
                </h3>
                <EditableContainer>
                  <p className="mb-3 text-justify">
                    <EditableText field={f('p1-day1-text')} focusClassName="py-0 text-[14px]/4" />
                  </p>
                </EditableContainer>
                <div className="flex flex-col gap-y-2 pl-2">
                  <p>
                    1. <b>Pre-procedure checks:</b> ECG and comprehensive blood work.
                  </p>
                  <p>
                    2. <b>Consultation:</b> An in-depth discussion with our doctor.
                  </p>
                  <p>
                    3. <b>Design Session:</b> A custom hairline design created with our aesthetic
                    team.
                  </p>
                </div>
                <p className="mt-3 text-justify">
                  The procedure will only commence after satisfactory medical clearance and your
                  final approval of the hairline design. It will be performed using the FUE
                  technique under local anaesthesia, typically lasting 6–8 hours. You will receive
                  all necessary post-procedure medications and{' '}
                  <span className="font-bold">one PRP session</span>.
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      {/* --- PAGE 2 --- */}
      <EditablePage index={1}>
        <article className="flex flex-col gap-y-6">
          {/* Day 2: Post-Procedure Check */}
          <div>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">Day 2: Post-Procedure Check </span>
              <EditableText field={f('p2-day2-date')} className="font-custom-commuters" />
            </h3>
            <p>
              Please return to the clinic for the removal of the donor area bandage and a progress
              evaluation by our medical team. We will confirm the appointment time during your
              procedure day.
            </p>
          </div>

          {/* Day 3: Aftercare Session */}
          <section>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">Day 3: Aftercare Session </span>
              <EditableText field={f('p2-day3-date')} className="font-custom-commuters" />
            </h3>
            <p>
              Your final visit includes your first professional hair wash and a detailed tutorial on
              your home-care routine, ensuring you are fully prepared to manage your recovery. We
              will confirm the appointment time during your check-up.
            </p>
          </section>

          {/* Section 3: Essential Prep */}
          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">3. ESSENTIAL PRE-PROCEDURE</span>
              <span className="block">PREPARATION</span>
            </h2>
            <p className="mb-4">
              Please adhere to these instructions to ensure optimal conditions for your procedure:
            </p>

            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Substance Abstinence:
                </h3>
                <p>
                  Refrain from consuming alcohol for <b> one week</b> before the procedure, as it
                  can thin the blood.
                </p>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Medication Management:
                </h3>
                <p>
                  Discontinue all blood-thinning medications (e.g., aspirin, ibuprofen) for{' '}
                  <b>one week</b> prior.
                </p>
                <div className="mt-4 mb-2 border border-primary/60 p-2 text-sm">
                  <b>Important:</b> You must obtain approval from your personal physician before
                  stopping any prescribed medication.
                </div>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Hair Preparation:
                </h3>
                <p>
                  Do not cut, trim, or shave your hair (including the back and sides) for{' '}
                  <b>one month</b>
                  before your appointment. This allows for an accurate assessment and the best
                  possible hairline design.
                </p>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Medical Disclosure:
                </h3>
                <p>
                  Please inform us of all regular medications (name and dose) and any known medical
                  conditions.
                </p>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Travel Logistics:
                </h3>
                <p>
                  Book your return flight <b>with checked baggage</b>. The provided aftercare
                  shampoo and medical foam exceed 100ml and cannot be carried in cabin luggage.
                </p>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Attire:
                </h3>
                <p>
                  Wear loose, comfortable clothing with a wide neck or front zipper (e.g., a
                  button-down shirt) on the procedure day and following days to avoid contact with
                  the treated area.
                </p>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Comfort Item:
                </h3>
                <p>
                  We highly recommend bringing a <b>U-shaped travel pillow</b> for sleeping during
                  the initial recovery nights to support proper head elevation.
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      {/* --- PAGE 3 --- */}
      <EditablePage index={2}>
        <article className="flex flex-col gap-y-6">
          {/* Section 4: Package Summary Header & List */}
          <section className="mt-4">
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">4. PACKAGE SUMMARY &</span>
              <span className="block">FINANCIAL AGREEMENT</span>
            </h2>

            <h3 className="mb-2 font-bold text-black">Your All-Inclusive Package Covers:</h3>
            <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
              <li>
                Hair Transplant procedure using the FUE technique, Dedicated interpreter services,
                and Post-care kit.
              </li>
              <li>Dedicated interpreter services.</li>
              <li>All post-procedure medications.</li>
              <li>One (1) PRP session.</li>
              <li>Post-care kit (Shampoo & Foam Spray).</li>
            </ul>
          </section>

          {/* Financial Terms */}
          <section>
            <h3 className="mb-2 font-bold text-black">Financial Terms:</h3>
            <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
              <EditableHide editKey={f('p3-finance-total-hide').editKey}>
                <li>
                  <span className="font-bold">Total Package Value: </span>
                  <EditableText field={f('p3-finance-total-val')} />
                </li>
              </EditableHide>
              <EditableHide editKey={f('p3-finance-deposit-hide').editKey}>
                <li>
                  <span className="font-bold">Deposit Received: </span>
                  <EditableText field={f('p3-finance-deposit-val')} />
                </li>
              </EditableHide>
              <EditableHide editKey={f('p3-finance-balance-hide').editKey}>
                <li>
                  <span className="font-bold">Outstanding Balance: </span>
                  <EditableText field={f('p3-finance-balance-val')} />
                </li>
              </EditableHide>
              <EditableHide editKey={f('p3-finance-duedate-hide').editKey}>
                <li>
                  <span className="font-bold">Balance Due Date: </span>
                  <EditableText field={f('p3-finance-duedate-val')} />
                </li>
              </EditableHide>
            </ul>
          </section>

          {/* --- PAYMENT DETAILS (Devam) --- */}
          <section>
            <h4 className="mb-2 flex items-center gap-x-1.5 text-[14px] font-bold text-primary-heavy">
              <SquareBullet /> Payment Details:
            </h4>
            <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
              <li>
                <p>
                  <span className="font-bold">Accepted Methods: </span>
                  Cash (EUR/USD/GBP), Major Cryptocurrencies, Debit/Credit Card, or Bank Transfer.
                </p>
              </li>
              <li>
                <p>
                  <span className="font-bold">Important Note: </span>
                  Payments via card are subject to a mandatory{' '}
                  <span className="font-bold">%10 VAT.</span>
                </p>
              </li>
              <li>
                <p>
                  <span className="font-bold">Accepted Currencies: </span>
                  EUR, USD, GBP, CAD, AUD, CHF, TRY. *We cannot accept: Scottish/Irish Pounds,
                  old-series US banknotes, or €500 denominations.*
                </p>
              </li>
              <li>
                <p>
                  <span className="font-bold">Prior to Travel: </span>
                  Please ensure your payment card is enabled for international transactions and has
                  a sufficient limit to cover the balance.
                </p>
              </li>
            </ul>
          </section>

          {/* --- SECTION 5: DEPOSIT & CANCELLATION --- */}
          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">5. DEPOSIT & CANCELLATION POLICY</span>
            </h2>

            <p className="mb-4">
              Your €500 deposit secures your appointment and is non-refundable. However, it will
              remain valid for a future date under these specific conditions:
            </p>

            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Rescheduling:
                </h3>
                <p>
                  Written notice via WhatsApp at least 14 days prior to your original appointment.
                </p>
              </div>

              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Medical Emergency:
                </h3>
                <p>Provision of a verifiable medical certificate.</p>
              </div>

              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Flight Cancellation:
                </h3>
                <p>Provision of official airline documentation</p>
              </div>

              <p className="mt-2 text-black">
                Failure to provide the required notice or documentation within the 14-day window
                will result in the forfeiture of your deposit.
              </p>
            </div>
          </section>
        </article>
      </EditablePage>

      {/* --- PAGE 4 --- */}
      <EditablePage index={3}>
        <article className="flex h-full flex-col">
          <div className="flex flex-col gap-y-6">
            {/* --- SECTION 6: FINAL STEPS --- */}
            <section>
              <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
                <span className="font-bold">6. FINAL STEPS & CONTACT</span>
                <span className="block">INFORMATION</span>
              </h2>

              <div className="flex flex-col gap-y-2">
                <p>
                  Should you have any questions prior to your journey, we are here to assist you.
                  <br /> <br />
                  We are committed to providing you with an exceptional experience and outstanding
                  results. We look forward to welcoming you to Istanbul. <br /> <br /> Warmest
                  regards,
                </p>
              </div>
            </section>
          </div>

          {/* --- FOOTER SECTION --- */}
          <section className="mt-6">
            <div className="flex items-center gap-x-6">
              {/* Logo */}
              <img src="/logo-x.svg" alt="Hair Of Istanbul" className="h-20 w-auto" />

              {/* Representative Name */}
              <div className="border-l border-stone-200 py-3 pl-6">
                <EditableText
                  field={f('p4-rep-name')}
                  className="font-custom-commuters text-[18px] font-medium text-black"
                />
              </div>
            </div>

            {/* Contact & Address Row (Justify Between) */}
            <div className="flex justify-between pt-6">
              {/* Left: Contact Info */}
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Contact</h4>
                <EditableLink
                  editKey={f('p4-rep-phone').editKey}
                  defaultValue={f('p4-rep-phone').defaultValue}
                  seedValue={f('p4-rep-phone').seedValue} // Seed value pass edildi
                  className="transition-colors hover:text-primary"
                />
                <a
                  href="https://www.hairofistanbul.com"
                  className="underline transition-colors hover:text-primary"
                >
                  www.hairofistanbul.com
                </a>
                <a
                  href="mailto:info@hairofistanbul.com"
                  className="underline transition-colors hover:text-primary"
                >
                  info@hairofistanbul.com
                </a>
              </div>

              {/* Right: Address Info */}
              <div className="flex max-w-[50%] flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Address</h4>
                <p className="text-left whitespace-pre-line">
                  Yalı Ataköy, Ataköy 2-5-6. Kısım Mah., Rauf Orbay Cd. No:4 D:C Blok, 34158
                  Bakırköy / İstanbul, Türkiye
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>
    </main>
  )
}
