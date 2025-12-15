import { useAuth } from '@/providers/auth'
import { EditableContainer } from '../components/editable-container'
import { EditableHide } from '../components/editable-hide'
import { EditableLink } from '../components/editable-link'
import { EditablePage } from '../components/editable-page'
import { EditableTextField } from '../components/editable-wrapper'
import { EditorMenu } from '../components/menu-editor'
import { useField } from '../hooks/use-field'

export const WithOtelPageEN = () => {
  const { user } = useAuth()

  const formData = [
    {
      name: 'Müşteri Adı',
      editKey: 'd1-p1-k1',
      defaultValue: 'Mr. Customer-Name',
      inputMode: 'text',
    },
    {
      name: 'Operasyon Tarihi (Ana)',
      editKey: 'd1-p1-k2',
      defaultValue: 'Tuesday, 28 July 1998',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Varış Tarihi',
      editKey: 'd1-p1-k3',
      defaultValue: '(Monday, 21 April 1997)',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Karşılama Metni',
      description: 'HTML etiketleri (b, i, u vb.) kullanılabilir.',
      editKey: 'd1-p1-k4',
      defaultValue: `Our team will greet you at Istanbul Airport (IST), Gate 8, in front of Simit Saray Café. A personal interpreter will provide a procedural overview and answer any initial questions. Following this, you will be privately transferred to your accommodation at the <b>5-star Crowne Plaza Istanbul Florya.</b>`,
      inputMode: 'textarea',
    },
    {
      name: 'Otel Adresi',
      editKey: 'd1-p1-k5',
      defaultValue:
        'Şenlikköy Mahallesi Yeşilköy Halkalı Cad 95 Florya, 34290 Bakırköy/İstanbul, Türkiye.',
      inputMode: 'text',
    },
    {
      name: 'Otel Web Sitesi',
      editKey: 'd1-p1-k6',
      defaultValue: {
        value: 'https://www.cpistanbulflorya.com/',
        type: 'https',
      },
      inputMode: 'link',
    },
    {
      name: 'Paket İçeriği',
      editKey: 'd1-p1-k7',
      defaultValue:
        '3-night stay, daily breakfast, and access to spa, fitness centre, swimming pool, Turkish Hammam, and sauna.',
      inputMode: 'textarea',
    },
    {
      name: 'Paket Dışı',
      editKey: 'd1-p1-k8',
      defaultValue: 'Minibar, massage, laundry, room service, and other ancillary charges.',
      inputMode: 'text',
    },
    {
      name: 'Ekstra Konaklama Bilgisi',
      editKey: 'd1-p1-k9',
      defaultValue:
        'Additional nights are available at <b>€135 per night for single occupancy</b> and <b>€160 per night for double occupancy</b>, payable directly by you.',
      inputMode: 'textarea',
    },
    {
      name: '2. Gün: Operasyon Tarihi',
      editKey: 'd1-p2-k1',
      defaultValue: '(Thursday, 26 March 2026)',
      inputMode: 'text',
    },
    {
      name: '3. Gün: Kontrol Tarihi',
      editKey: 'd1-p2-k2',
      defaultValue: '(Saturday, 28 March 2026)',
      inputMode: 'text',
    },
    {
      name: '4. Gün: Ayrılış Tarihi',
      editKey: 'd1-p2-k3',
      defaultValue: '(Sunday, 29 March 2026)',
      inputMode: 'text',
    },
    {
      name: 'Otel Bilgisi',
      editKey: 'd1-p3-i1',
      defaultValue: '3 nights at Crowne Plaza Istanbul Florya (5-star).',
      inputMode: 'text',
    },
    {
      name: 'Toplam Paket Değeri',
      editKey: 'd1-p3-f1-e1',
      defaultValue: '$4,300',
      inputMode: 'text',
    },
    {
      name: 'Toplamı Gizle',
      editKey: 'd1-p3-f1-h1',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Depozito Miktarı',
      editKey: 'd1-p3-f2-e2',
      defaultValue: '€500 (Non-refundable)',
      inputMode: 'text',
    },
    {
      name: 'Depozitoyu Gizle',
      editKey: 'd1-p3-f2-h2',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Kalan Bakiye',
      editKey: 'd1-p3-f3-e3',
      defaultValue: '€3,800',
      inputMode: 'text',
    },
    {
      name: 'Bakiyeyi Gizle',
      editKey: 'd1-p3-f3-h3',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Son Ödeme Tarihi Hakkında',
      editKey: 'd1-p3-f4-e4',
      defaultValue: 'In full on the day of the procedure.',
      inputMode: 'text',
    },
    {
      name: 'Son Ödeme Tarihini Gizle',
      editKey: 'd1-p3-f4-h4',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Temsilci Adı',
      editKey: 'd1-p4-k1',
      defaultValue: 'YOUR-NAME',
      seedValue: user?.name,
      inputMode: 'text',
    },
    {
      name: 'Temsilci Telefonu',
      editKey: 'd1-p4-k2',
      defaultValue: {
        value: '+90 532 650 00 00',
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
  ] as const satisfies FormFieldConfig[]

  const f = useField(formData)

  return (
    <div className="flex flex-col bg-gray-50 text-black md:items-center md:justify-center">
      <EditorMenu formData={formData} />
      <EditablePage index={0} className="text-[10.5px] leading-relaxed">
        <header className="flex flex-col gap-y-1">
          <h1 className="font-semibold">
            Dear <EditableTextField field={f('d1-p1-k1')} className="font-bold" />,
          </h1>

          <p>
            We hope this message finds you well. On behalf of the entire team at Hair of Istanbul,
            we are delighted to formally confirm your scheduled hair transplant procedure for{' '}
            <EditableTextField field={f('d1-p1-k2')} className="font-bold" />
            .This document serves as your comprehensive appointment confirmation and guide. To
            ensure a seamless and successful experience, we kindly ask you to review the following
            information carefully.
          </p>
        </header>

        <article className="mt-6 flex flex-col gap-y-6">
          <section>
            <h2 className="font-custom-commuters text-[14px] text-primary">
              <span className="font-bold">1. CRITICAL MEDICAL INFORMATION</span>
              <span className="block">& DISCLOSURES</span>
            </h2>

            <div className="mt-2 flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                  Pre-Procedure Screening
                </h3>
                <p>
                  We will conduct mandatory HIV and Hepatitis B/C blood tests at our clinic on the
                  day of your procedure. A positive result for either condition will regrettably
                  prevent us from performing the procedure.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Procedure
                  Contraindications:
                </h3>
                <p>
                  If you have a history of Epilepsy, keloid scarring (anywhere on your body), or
                  Diabetes,{' '}
                  <span className="font-bold">
                    please contact your customer representative at your earliest convenience.
                  </span>{' '}
                  These conditions require a specific medical review and may prevent us from
                  proceeding.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Required
                  Medical Disclosure:
                </h3>
                <p>
                  You are required to inform your dedicated customer representative via WhatsApp if
                  you have any other chronic medical conditions, such as:
                </p>
                <ul className="ml-4 list-disc">
                  <li>Heart disease</li>
                  <li>High blood pressure</li>
                  <li>Eczema or seborrheic dermatitis</li>
                  <li>
                    Or if you are taking any regular prescription or over-the-counter medications.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Potential
                  Postponement:
                </h3>
                <p>
                  If active eczema or seborrheic dermatitis is present in the donor or recipient
                  areas, the procedure may need to be postponed by 3–5 days to allow the skin to
                  heal fully. In such cases, you would be responsible for all associated costs
                  related to rescheduling your flight and extending your hotel stay.
                </p>
              </div>

              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold"> Day 1: Arrival & </span>
                  <EditableTextField field={f('d1-p1-k3')} />
                </h2>
                <EditableContainer className="mt-2">
                  <p>
                    <EditableTextField field={f('d1-p1-k4')} focusClassName="py-0 text-xs/6" />
                  </p>
                </EditableContainer>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Hotel
                  Address:
                </h3>
                <p>
                  <EditableTextField field={f('d1-p1-k5')} />
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Web Address:
                </h3>
                <p>
                  <EditableLink
                    editKey={f('d1-p1-k6').editKey}
                    href={f('d1-p1-k6').defaultValue.value}
                    linkType={f('d1-p1-k6').defaultValue.type}
                    className="underline transition-colors hover:text-primary"
                  />
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Package
                  Inclusions:
                </h3>
                <p>
                  <EditableTextField field={f('d1-p1-k7')} />
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Exclusions:
                </h3>
                <p>
                  <EditableTextField field={f('d1-p1-k8')} />
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Extended
                  Stays:
                </h3>
                {/* Tek parça (HTML destekli) editable alan */}
                <p>
                  <EditableTextField field={f('d1-p1-k9')} />
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={1} className="text-[10.5px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <h2 className="text-[14px]">
              <span className="font-bold">Day 2: Arrival & Welcome </span>
              <EditableTextField field={f('d1-p2-k1')} />
            </h2>
            <p>
              You will be collected from your hotel and taken to our clinic. The day will proceed as
              follows:
            </p>

            <div className="mt-3 flex flex-col gap-y-3">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                  Pre-procedure checks:
                </h3>
                <p>ECG and comprehensive blood work.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                  Consultation:
                </h3>
                <p>An in-depth discussion with our doctor.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Design
                  Session:
                </h3>
                <p>A custom hairline design created with our aesthetic team.</p>
              </div>
            </div>

            <p className="mt-3">
              The procedure will only commence after satisfactory medical clearance and your final
              approval of the hairline design. It will be performed using the Follicular Unit
              Extraction (FUE) technique with micromotors under local anaesthesia, typically lasting
              6-8 hours. You will receive all necessary post-procedure medications and{' '}
              <span className="font-bold">one PRP session</span> as part of your package.
            </p>
          </section>

          <section>
            <h2 className="text-[14px]">
              <span className="font-bold">Day 3: Pos and Procedure Check </span>
              <EditableTextField field={f('d1-p2-k2')} />
            </h2>
            <p>
              You will return to the clinic for the removal of the donor area bandage and a progress
              evaluation by our medical team.
            </p>
          </section>

          <section>
            <h2 className="text-[14px]">
              <span className="font-bold"> Day 4: Aftercare & Departure </span>
              <EditableTextField field={f('d1-p2-k3')} />
            </h2>
            <p>
              You will be collected from your hotel and taken to our clinic. The day will proceed as
              follows:
            </p>

            <div className="mt-3 flex flex-col gap-y-3">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                  Pre-procedure checks:
                </h3>
                <p>ECG and comprehensive blood work.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                  Consultation:
                </h3>
                <p>An in-depth discussion with our doctor.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Design
                  Session:
                </h3>
                <p>A custom hairline design created with our aesthetic team.</p>
              </div>
            </div>

            <p className="mt-3">
              The procedure will only commence after satisfactory medical clearance and your final
              approval of the hairline design. It will be performed using the Follicular Unit
              Extraction (FUE) technique with micromotors under local anaesthesia, typically lasting
              6-8 hours. You will receive all necessary post-procedure medications and{' '}
              <span className="font-bold">one PRP session</span> as part of your package.
            </p>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={2} className="text-[10.5px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section className="flex flex-col gap-y-4">
            <div>
              <h3 className="font-bold text-primary">
                <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Hair
                Preparation:
              </h3>
              <p>
                Do not cut, trim, or shave your hair (including the back and sides) for one month
                before your appointment. This allows for an accurate assessment and the best
                possible hairline design.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-primary">
                <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Medical
                Disclosure:
              </h3>
              <p>
                Please inform us of all regular medications (name and dose) and any known medical
                conditions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-primary">
                <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Travel
                Logistics:
              </h3>
              <p>
                Book your return flight with checked baggage. The provided aftercare shampoo and
                medical foam exceed 100ml and cannot be carried in cabin luggage.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-primary">
                <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Attire:
              </h3>
              <p>
                Wear loose, comfortable clothing with a wide neck or front zipper (e.g., a
                button-down shirt) on the procedure day and following days to avoid contact with the
                treated area.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-primary">
                <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Comfort Item:
              </h3>
              <p>
                We highly recommend bringing a U-shaped travel pillow for sleeping during the
                initial recovery nights to support proper head elevation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-custom-commuters text-[14px] text-primary uppercase">
              <span className="font-bold">4. PACKAGE SUMMARY &</span>
              <span className="block">FINANCIAL AGREEMENT</span>
            </h2>

            <div className="mt-4">
              <h3 className="mb-2 font-bold text-black">Your All-Inclusive Package Covers:</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Hair Transplant procedure using the FUE technique.</li>
                <li>All private transfers (Airport ⇄ Hotel ⇄ Clinic).</li>
                <li>Dedicated interpreter services.</li>
                <li>
                  <EditableTextField field={f('d1-p3-i1')} />
                </li>
                <li>All post-procedure medications.</li>
                <li>One (1) PRP session.</li>
                <li>Post-care kit (Shampoo & Foam Spray).</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-bold text-black">Financial Terms:</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  <EditableHide editKey={f('d1-p3-f1-h1').editKey}>
                    <span className="font-bold">Total Package Value: </span>
                    <EditableTextField field={f('d1-p3-f1-e1')} />
                  </EditableHide>
                </li>

                <li>
                  <EditableHide editKey={f('d1-p3-f2-h2').editKey}>
                    <span className="font-bold">Deposit Received: </span>
                    <EditableTextField field={f('d1-p3-f2-e2')} />
                  </EditableHide>
                </li>

                <li>
                  <EditableHide editKey={f('d1-p3-f3-h3').editKey}>
                    <span className="font-bold">Outstanding Balance: </span>
                    <EditableTextField field={f('d1-p3-f3-e3')} />
                  </EditableHide>
                </li>

                <li>
                  <EditableHide editKey={f('d1-p3-f4-h4').editKey}>
                    <span className="font-bold">Balance Due Date: </span>
                    <EditableTextField field={f('d1-p3-f4-e4')} />
                  </EditableHide>
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-bold text-black">Payment Details:</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  <span className="font-bold">Accepted Methods: </span>
                  Cash (EUR/USD/GBP), Major Cryptocurrencies, Debit/Credit Card, or Bank Transfer.
                </li>
                <li>
                  <span className="font-bold">Important Note: </span>
                  Payments via card are subject to a mandatory{' '}
                  <span className="font-bold">10% VAT.</span>
                </li>
                <li>
                  <span className="font-bold">Accepted Currencies: </span>
                  EUR, USD, GBP, CAD, AUD, CHF, TRY. *We cannot accept: Scottish/Irish Pounds,
                  old-series US banknotes, or €500 denominations.*
                </li>
                <li>
                  <span className="font-bold">Prior to Travel: </span>
                  Please ensure your payment card is enabled for international transactions and has
                  a sufficient limit to cover the balance.
                </li>
              </ul>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={3} className="text-[10.5px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <h2 className="mb-3 font-custom-commuters text-[14px] text-primary uppercase">
              <span className="font-bold">5. DEPOSIT & CANCELLATION POLICY</span>
            </h2>

            <p className="mb-4">
              Your €500 deposit secures your appointment and is non-refundable. However, it will
              rearticle valid for a future date under these specific conditions:
            </p>

            <div className="flex flex-col gap-y-3">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                  Rescheduling:
                </h3>
                <p>
                  Written notice via WhatsApp at least 14 days prior to your original appointment.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Medical
                  Emergency:
                </h3>
                <p>Provision of a verifiable medical certificate.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Flight
                  Cancellation:
                </h3>
                <p>Provision of official airline documentation</p>
              </div>

              <p className="mt-2 text-black">
                Failure to provide the required notice or documentation within the 14-day window
                will result in the forfeiture of your deposit.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-custom-commuters text-[14px] text-primary uppercase">
              <span className="font-bold">6. FINAL STEPS & CONTACT</span>
              <span className="block">INFORMATION</span>
            </h2>

            <div className="flex flex-col gap-y-2">
              <p>Should you have any questions prior to your journey, we are here to assist you.</p>
              <p>
                We are committed to providing you with an exceptional experience and outstanding
                results. We look forward to welcoming you to Istanbul.
              </p>
              <p className="mt-2 font-semibold text-black">Warmest regards,</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-x-4">
              {/* Logo */}
              <img src="/logo-x.svg" alt="Hair Of Istanbul" className="h-24 w-28" />

              <div className="border-l border-gray-200 py-4 pl-4 text-[16px] font-bold text-black">
                <EditableTextField field={f('d1-p4-k1')} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-8 border-t border-gray-200 pt-6">
              {/* Contact Column */}
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Contact</h4>

                <EditableLink
                  editKey={f('d1-p4-k2').editKey}
                  href={f('d1-p4-k2').defaultValue.value}
                  linkType={f('d1-p4-k2').seedValue?.type || f('d1-p4-k2').defaultValue.type}
                  seedValue={f('d1-p4-k2').seedValue?.value}
                />

                <a href="https://www.hairofistanbul.com" className="underline">
                  www.hairofistanbul.com
                </a>

                <a href="mailto:info@hairofistanbul.com" className="underline">
                  info@hairofistanbul.com
                </a>
              </div>

              {/* Address Column */}
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Address</h4>
                <p className="whitespace-pre-line">
                  Yalı Ataköy, Ataköy 2-5-6. Kısım Mah., Rauf Orbay Cd. No:4 D:C Blok, 34158
                  Bakırköy / İstanbul, Türkiye
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>
    </div>
  )
}
