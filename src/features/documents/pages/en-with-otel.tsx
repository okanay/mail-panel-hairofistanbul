import { useAuth } from '@/providers/auth'
import { EditableContainer } from '../components/editable-container'
import { EditableHide } from '../components/editable-hide'
import { EditableLink } from '../components/editable-link'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { EditorMenu } from '../components/menu-editor'
import { useField } from '../hooks/use-field'
import { SquareBullet } from '../components/icon-square'

export const WithOtelPageEN = () => {
  const { user } = useAuth()

  const formData = [
    // --- PAGE : 1 ---
    {
      name: 'Müşteri Adı',
      editKey: 'p1-customer-name',
      defaultValue: 'Mr. Breuer',
      inputMode: 'text',
    },
    {
      name: 'Operasyon Tarihi (Giriş)',
      editKey: 'p1-proc-date-main',
      defaultValue: 'Friday, 27 March 2026',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Tarih',
      editKey: 'p1-day1-date',
      defaultValue: 'Thursday, 26 March 2026',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Karşılama Metni',
      description: 'HTML (b, i) kullanılabilir. Kapı numarası vb. için.',
      editKey: 'p1-day1-text',
      defaultValue: `Our team will greet you at Istanbul Airport (IST), Gate 8, in front of Simit Saray Café. A personal interpreter will provide a procedural overview and answer any initial questions. Following this, you will be privately transferred to your accommodation at the <b>5-star Crowne Plaza Istanbul Florya.</b>`,
      inputMode: 'textarea',
    },
    {
      name: 'Otel Adresi',
      editKey: 'p1-hotel-address',
      defaultValue:
        'Şenlikköy Mahallesi Yeşilköy Halkalı Cad 95 Florya, 34290 Bakırköy/İstanbul, Türkiye.',
      inputMode: 'text',
    },
    {
      name: 'Otel Web Sitesi',
      editKey: 'p1-hotel-web',
      defaultValue: {
        value: 'https://www.cpistanbulflorya.com/',
        type: 'https',
      },
      inputMode: 'link',
    },
    // --- PAGE : 2 ---
    {
      name: 'Paket Dahilindekiler',
      editKey: 'p2-package-inclusions',
      defaultValue:
        '3-night stay, daily breakfast, and access to spa, fitness centre, swimming pool, Turkish Hammam, and sauna.',
      inputMode: 'text',
    },
    {
      name: 'Dahil Olmayanlar',
      editKey: 'p2-exclusions',
      defaultValue: 'Minibar, massage, laundry, room service, and other ancillary charges.',
      inputMode: 'text',
    },
    {
      name: 'Ekstra Konaklama Bilgisi',
      editKey: 'p2-extended-stays',
      description: 'Fiyatlar ve koşullar',
      defaultValue: `Additional nights are available at <b>€135 per night for single occupancy</b> and <b>€160 per night for double occupancy</b>, payable directly by you.`,
      inputMode: 'textarea',
    },
    {
      name: '2. Gün: Operasyon Tarihi',
      editKey: 'p2-day2-date',
      defaultValue: '( Thursday, 26 March 2026 )',
      inputMode: 'text',
    },
    {
      name: '3. Gün: Kontrol Tarihi',
      editKey: 'p2-day3-date',
      defaultValue: '( Saturday, 28 March 2026 )',
      inputMode: 'text',
    },
    {
      name: '4. Gün: Ayrılış Tarihi',
      editKey: 'p2-day4-date',
      defaultValue: '( Sunday, 29 March 2026 )',
      inputMode: 'text',
    },
    // --- PAGE : 3 ---
    {
      name: 'Otel Bilgisi (Paket İçeriği)',
      editKey: 'p3-hotel-info',
      defaultValue: '3 nights at Crowne Plaza Istanbul Florya (5-star).',
      inputMode: 'text',
    },
    {
      name: 'Toplam Paket Değeri',
      editKey: 'p3-finance-total-val',
      defaultValue: '€4,300',
      inputMode: 'text',
    },
    {
      name: 'Toplamı Gizle',
      editKey: 'p3-finance-total-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Depozito Miktarı',
      editKey: 'p3-finance-deposit-val',
      defaultValue: '€500 (Non-refundable)',
      inputMode: 'text',
    },
    {
      name: 'Depozitoyu Gizle',
      editKey: 'p3-finance-deposit-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Kalan Bakiye',
      editKey: 'p3-finance-balance-val',
      defaultValue: '€3,800',
      inputMode: 'text',
    },
    {
      name: 'Bakiyeyi Gizle',
      editKey: 'p3-finance-balance-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Son Ödeme Tarihi Bilgisi',
      editKey: 'p3-finance-duedate-val',
      defaultValue: 'In full on the day of the procedure.',
      inputMode: 'text',
    },
    {
      name: 'Son Ödeme Tarihini Gizle',
      editKey: 'p3-finance-duedate-hide',
      defaultValue: false,
      inputMode: 'toggle',
    },
    // --- PAGE : 4 ---
    {
      name: 'Temsilci Adı',
      editKey: 'p4-rep-name',
      defaultValue: 'Ergun Meylani',
      seedValue: user?.name,
      inputMode: 'text',
    },
    {
      name: 'Temsilci Telefonu',
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
      {/* PAGE : 1 */}
      <EditablePage index={0}>
        <article className="flex flex-col gap-y-6">
          {/* --- GREETING SECTION --- */}
          <section className="flex flex-col gap-y-2">
            <h1 className="text-[15px] font-bold text-black">
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

          {/* --- SECTION 1: MEDICAL INFO --- */}
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

          {/* --- SECTION 2: ITINERARY --- */}
          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">2. YOUR APPOINTMENT</span>
              <span className="block">SCHEDULE AND ITINERARY</span>
            </h2>

            <div className="flex flex-col gap-y-4">
              {/* Day 1 Detail */}
              <div>
                <h3 className="mb-2 text-[16px] text-black">
                  <span className="font-bold">Day 1: Arrival & Welcome </span>
                  ( <EditableText field={f('p1-day1-date')} className="font-custom-commuters" /> )
                </h3>

                <EditableContainer>
                  <p className="text-justify">
                    <EditableText field={f('p1-day1-text')} focusClassName="py-0 text-[14px]/4" />
                  </p>
                </EditableContainer>
              </div>

              {/* Address & Web Info Block */}
              <div className="mt-2 flex flex-col gap-y-3">
                <div>
                  <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                    <SquareBullet /> Hotel Address:
                  </h4>
                  <p>
                    <EditableText field={f('p1-hotel-address')} />
                  </p>
                </div>

                <div>
                  <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                    <SquareBullet /> Web Address:
                  </h4>
                  <p>
                    <EditableLink
                      editKey={f('p1-hotel-web').editKey}
                      defaultValue={f('p1-hotel-web').defaultValue}
                      className="underline transition-colors hover:text-primary"
                    />
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>
      {/* PAGE : 2 */}
      <EditablePage index={1}>
        <article className="flex flex-col gap-y-6">
          {/* --- SECTION: INCLUSIONS / EXCLUSIONS --- */}
          {/* Bu bölüm görselde üstte yer alıyor, stil olarak Page 1'in devamı */}
          <section className="flex flex-col gap-y-4">
            {/* Inclusions */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Package Inclusions:
              </h3>
              <p>
                <EditableText
                  field={f('p2-package-inclusions')}
                  focusClassName="py-0 text-[14px]/4"
                />
              </p>
            </div>

            {/* Exclusions */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Exclusions:
              </h3>
              <p>
                <EditableText field={f('p2-exclusions')} focusClassName="py-0 text-[14px]/4" />
              </p>
            </div>

            {/* Extended Stays (Editable Text kullandım çünkü fiyat değişebilir) */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Extended Stays:
              </h3>
              <EditableContainer>
                <p>
                  <EditableText
                    field={f('p2-extended-stays')}
                    focusClassName="py-0 text-[14px]/4"
                  />
                </p>
              </EditableContainer>
            </div>
          </section>

          {/* --- SECTION: DAY 2 PROCEDURE --- */}
          <section>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">Day 2: Procedure Day </span>
              <EditableText field={f('p2-day2-date')} className="font-custom-commuters" />
            </h3>

            <p className="mb-4">
              You will be collected from your hotel and taken to our clinic. The day will proceed as
              follows:
            </p>

            <div className="mb-4 flex flex-col gap-y-4">
              <div>
                <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Pre-procedure checks:
                </h4>
                <p>ECG and comprehensive blood work.</p>
              </div>

              <div>
                <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Consultation:
                </h4>
                <p>An in-depth discussion with our doctor.</p>
              </div>

              <div>
                <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Design Session:
                </h4>
                <p>A custom hairline design created with our aesthetic team.</p>
              </div>
            </div>

            <p className="text-justify">
              The procedure will only commence after satisfactory medical clearance and your final
              approval of the hairline design. It will be performed using the Follicular Unit
              Extraction (FUE) technique with micromotors under local anaesthesia, typically lasting
              6–8 hours. You will receive all necessary post-procedure medications and{' '}
              <span className="font-bold">one PRP session</span> as part of your package.
            </p>
          </section>

          {/* --- SECTION: DAY 3 CHECK --- */}
          <section>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">Day 3: Post-Procedure Check </span>
              <EditableText field={f('p2-day3-date')} className="font-custom-commuters" />
            </h3>
            <p>
              You will return to the clinic for the removal of the donor area bandage and a progress
              evaluation by our medical team.
            </p>
          </section>

          {/* --- SECTION: DAY 4 DEPARTURE --- */}
          <section>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">Day 4: Aftercare & Departure </span>
              <EditableText field={f('p2-day4-date')} className="font-custom-commuters" />
            </h3>
            <p className="text-justify">
              Your final visit includes your first professional hair wash and a detailed tutorial on
              your home-care routine. You will then be privately transferred to the airport
              approximately{' '}
              <span className="font-bold">3 hours before your scheduled departure.</span>
            </p>
          </section>

          {/* --- SECTION 3: PREPARATION --- */}
          <section className="mt-2">
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">3. ESSENTIAL PRE-PROCEDURE</span>
              <span className="block">PREPARATION</span>
            </h2>

            <p className="mb-4">
              Please adhere to these instructions to ensure optimal conditions for your procedure:
            </p>

            {/* Substance Abstinence */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Substance Abstinence:
              </h3>
              <p>
                Refrain from consuming alcohol for <span className="font-bold">one week</span>{' '}
                before the procedure, as it can thin the blood.
              </p>
            </div>
          </section>
        </article>
      </EditablePage>
      {/* PAGE : 3 */}
      <EditablePage index={2}>
        <article className="flex flex-col gap-y-6">
          {/* --- SECTION: PREPARATION (Continued from Page 2) --- */}
          <section className="flex flex-col gap-y-4">
            {/* Medication Management */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Medication Management:
              </h3>
              <p>
                Discontinue all blood-thinning medications (e.g., aspirin, ibuprofen) for{' '}
                <span className="font-bold">one week</span> prior.
              </p>
            </div>

            {/* Important Box */}
            <div className="border border-primary/60 p-3">
              <p className="leading-snug">
                <span className="font-bold">Important:</span> You must obtain approval from your
                personal physician before stopping any prescribed medication.
              </p>
            </div>

            {/* Hair Preparation */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Hair Preparation:
              </h3>
              <p>
                Do not cut, trim, or shave your hair (including the back and sides) for{' '}
                <b>one month</b> before your appointment. This allows for an accurate assessment and
                the best possible hairline design.
              </p>
            </div>

            {/* Medical Disclosure */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Medical Disclosure:
              </h3>
              <p>
                Please inform us of all regular medications (name and dose) and any known medical
                conditions.
              </p>
            </div>

            {/* Travel Logistics */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Travel Logistics:
              </h3>
              <p>
                Book your return flight <b>with checked baggage</b>. The provided aftercare shampoo
                and medical foam exceed 100ml and cannot be carried in cabin luggage.
              </p>
            </div>

            {/* Attire */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Attire:
              </h3>
              <p>
                Wear loose, comfortable clothing with a wide neck or front zipper (e.g., a
                button-down shirt) on the procedure day and following days to avoid contact with the
                treated area.
              </p>
            </div>

            {/* Comfort Item */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Comfort Item:
              </h3>
              <p>
                We highly recommend bringing a <b>U-shaped travel pillow</b> for sleeping during the
                initial recovery nights to support proper head elevation.
              </p>
            </div>
          </section>

          {/* --- SECTION 4: PACKAGE SUMMARY & FINANCIAL --- */}
          <section className="mt-2">
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">4. PACKAGE SUMMARY &</span>
              <span className="block">FINANCIAL AGREEMENT</span>
            </h2>

            {/* Inclusions List */}
            <div className="mb-5">
              <h3 className="mb-2 font-bold text-black">Your All-Inclusive Package Covers:</h3>
              <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                <li>Hair Transplant procedure using the FUE technique.</li>
                <li>All private transfers (Airport ⇄ Hotel ⇄ Clinic).</li>
                <li>Dedicated interpreter services.</li>
                <li>
                  {/* Editable Hotel Info */}
                  <EditableText field={f('p3-hotel-info')} />
                </li>
                <li>All post-procedure medications.</li>
                <li>One (1) PRP session.</li>
                <li>Post-care kit (Shampoo & Foam Spray).</li>
              </ul>
            </div>

            {/* Financial Terms (Hideable Areas) */}
            <div>
              <h3 className="mb-2 font-bold text-black">Financial Terms:</h3>
              <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                {/* Total Value */}
                <EditableHide editKey={f('p3-finance-total-hide').editKey}>
                  <li>
                    <span className="font-bold">Total Package Value: </span>
                    <EditableText field={f('p3-finance-total-val')} />
                  </li>
                </EditableHide>

                {/* Deposit */}
                <EditableHide editKey={f('p3-finance-deposit-hide').editKey}>
                  <li>
                    <span className="font-bold">Deposit Received: </span>
                    <EditableText field={f('p3-finance-deposit-val')} />
                  </li>
                </EditableHide>

                {/* Outstanding Balance */}
                <EditableHide editKey={f('p3-finance-balance-hide').editKey}>
                  <li>
                    <span className="font-bold">Outstanding Balance: </span>
                    <EditableText field={f('p3-finance-balance-val')} />
                  </li>
                </EditableHide>

                {/* Due Date */}
                <EditableHide editKey={f('p3-finance-duedate-hide').editKey}>
                  <li>
                    <span className="font-bold">Balance Due Date: </span>
                    <EditableText field={f('p3-finance-duedate-val')} />
                  </li>
                </EditableHide>
              </ul>
            </div>
          </section>
        </article>
      </EditablePage>
      {/* PAGE : 4 */}
      <EditablePage index={3}>
        <article className="flex h-full flex-col">
          <div className="flex flex-col gap-y-6">
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
                    <span className="font-bold">10% VAT.</span>
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
                    Please ensure your payment card is enabled for international transactions and
                    has a sufficient limit to cover the balance.
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
