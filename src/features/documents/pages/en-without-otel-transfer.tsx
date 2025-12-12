import { useAuth } from '@/providers/auth'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { EditorMenu } from '../components/menu-editor'
import { EditableLink } from '../components/editable-link'
import { HideableText } from '../components/hideable-text'

export const WithoutOtelTransferPageEN = () => {
  const { user } = useAuth()

  // Form Data Definition for WithoutOtelTransferPageEN
  const formData: DocumentFormData = [
    {
      name: 'Customer Name',
      editKey: 'd3-p1-k1',
      defaultValue: 'Mr. Customer-Name',
      inputMode: 'text',
    },
    {
      name: 'Operation Date (Main)',
      editKey: 'd3-p1-k2',
      defaultValue: 'Tuesday, 28 July 1998',
      inputMode: 'text',
    },
    {
      name: 'Day 1: Arrival Date',
      editKey: 'd3-p1-k3',
      defaultValue: '(Thursday, 26 March 2026)',
      inputMode: 'text',
    },
    {
      name: 'Day 2: Procedure Date',
      editKey: 'd3-p1-k4',
      defaultValue: '(Friday, 27 March 2026)',
      inputMode: 'text',
    },
    {
      name: 'Day 3: Check-up Date',
      editKey: 'd3-p2-k1',
      defaultValue: '(Saturday, 28 March 2026)',
      inputMode: 'text',
    },
    {
      name: 'Financial: Total Package Value',
      editKey: 'd3-p3-k2-e1',
      defaultValue: '$4,300',
      inputMode: 'text',
    },
    {
      name: 'Financial: Toggle Total Value',
      editKey: 'd3-p3-k1-h1',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Financial: Deposit Amount',
      editKey: 'd3-p3-k4-e2',
      defaultValue: '€500 (Non-refundable)',
      inputMode: 'text',
    },
    {
      name: 'Financial: Toggle Deposit',
      editKey: 'd3-p3-k3-h2',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Financial: Remaining Balance',
      editKey: 'd3-p3-k6-e3',
      defaultValue: '€3,800',
      inputMode: 'text',
    },
    {
      name: 'Financial: Toggle Balance',
      editKey: 'd3-p3-k5-h3',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Financial: Toggle Due Date',
      editKey: 'd3-p3-k7-h4',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Agent: Name',
      editKey: 'd3-p3-k8',
      defaultValue: 'YOUR-NAME',
      seedValue: user?.name,
      inputMode: 'text',
    },
    {
      name: 'Agent: Phone Number',
      editKey: 'd3-p3-k9',
      defaultValue: {
        value: '+90 532 650 00 00',
        type: 'tel',
      } as LinkData,
      seedValue: user?.phone
        ? ({
            value: user.phone,
            type: 'tel',
          } as LinkData)
        : undefined,
      inputMode: 'link',
    },
  ]

  return (
    <div className="flex flex-col bg-gray-50 text-black md:items-center md:justify-center">
      <EditorMenu formData={formData} />
      <EditablePage index={0} className="text-[10px] leading-relaxed">
        <header className="flex flex-col gap-y-1">
          <h1 className="font-semibold">
            Dear <EditableText editKey="d3-p1-k1">{'Mr. Customer-Name'}</EditableText>,
          </h1>

          <p>
            We hope this message finds you well. On behalf of the entire team at Hair of Istanbul,
            we are delighted to formally confirm your scheduled hair transplant procedure for{' '}
            <EditableText editKey="d3-p1-k2" className="font-bold">
              {'Tuesday, 28 July 1998'}
            </EditableText>
            .This email serves as your comprehensive appointment confirmation and guide. To ensure a
            seamless and successful experience, we kindly ask you to review the following
            information carefully.
          </p>
        </header>

        <article className="mt-6 flex flex-col gap-y-6">
          <section>
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">1. CRITICAL MEDICAL INFORMATION</span>
              <span className="block">& DISCLOSURES</span>
            </h2>

            <p className="my-2">
              Your safety is our highest priority. Please note the following mandatory conditions: 
            </p>

            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">■ Pre-Procedure Screening</h3>
                <p>
                  We will conduct mandatory HIV and Hepatitis B/C blood tests at our clinic on the
                  day of your procedure. A positive result for either condition will regrettably
                  prevent us from performing the procedure.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Procedure Contraindications:</h3>
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
                <h3 className="font-bold text-primary">■ Required Medical Disclosure:</h3>
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
                <h3 className="font-bold text-primary">■ Potential Postponement:</h3>
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
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">2. YOUR APPOINTMENT</span>
              <span className="block">SCHEDULE & ITINERARY</span>
            </h2>

            <div className="mt-2 flex flex-col gap-y-5">
              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Day 1: Arrival & Welcome </span>
                  <EditableText editKey="d3-p1-k3">{'(Thursday, 26 March 2026)'}</EditableText>
                </h2>

                <p className="mb-2">
                  You will receive a message with your precise arrival time one day prior to your
                  appointment. Please proceed to our clinic at the confirmed time. The day will
                  proceed as follows:
                </p>

                <div className="mb-3 space-y-1">
                  <div>
                    <span className="font-bold">1. Pre-procedure checks: </span>
                    <span>ECG and comprehensive blood work.</span>
                  </div>
                  <div>
                    <span className="font-bold">2. Consultation: </span>
                    <span>An in-depth discussion with our doctor.</span>
                  </div>
                  <div>
                    <span className="font-bold">3. Design Session: </span>
                    <span>
                      A custom hairline design created with our aesthetic team. The procedure will
                      only commence after satisfactory medical clearance and your final approval of
                      the hairline design. It will be performed using the Follicular Unit Extraction
                      (FUE) technique with micromotors under local anaesthesia, typically lasting
                      6–8 hours. You will receive all necessary post-procedure medications and{' '}
                      <span className="font-bold">one PRP session</span> as part of your package.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Day 2: Procedure Day </span>
                  <EditableText editKey="d3-p1-k4">{'(Friday, 27 March 2026)'}</EditableText>
                </h2>
                <p>
                  Please return to the clinic for the removal of the donor area bandage and a
                  progress evaluation by our medical team. We will confirm the appointment time
                  during your procedure day.
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={1} className="text-[10px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <h2 className="text-[14px]">
              <span className="font-bold">Day 3: Pos and Procedure Check </span>
              <EditableText editKey="d3-p2-k1">{'(Saturday, 28 March 2026)'}</EditableText>
            </h2>
            <p>
              Your final visit includes your first professional hair wash and a detailed tutorial on
              your home-care routine, ensuring you are fully prepared to manage your recovery. We
              will confirm the appointment time during your check-up.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">3. ESSENTIAL PRE-PROCEDURE</span>
              <span className="block">PREPARATION</span>
            </h2>

            <p className="mt-2">
              Please adhere to these instructions to ensure optimal conditions for your procedure:
            </p>

            <div className="mt-3 flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">■ Substance Abstinence:</h3>
                <p>
                  Refrain from consuming alcohol for <span className="font-bold">one week</span>{' '}
                  before the procedure, as it can thin the blood.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Medication Management:</h3>
                <p>
                  Discontinue all blood-thinning medications (e.g., aspirin, ibuprofen) for{' '}
                  <span className="font-bold">one week</span> prior.
                </p>
              </div>

              <div className="rounded-xs border border-primary bg-white p-2">
                <p>
                  <span className="font-bold">Important:</span> You must obtain approval from your
                  personal physician before stopping any prescribed medication.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Hair Preparation:</h3>
                <p>
                  Do not cut, trim, or shave your hair (including the back and sides) for{' '}
                  <span className="font-bold">one month</span>
                  before your appointment. This allows for an accurate assessment and the best
                  possible hairline design.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Medical Disclosure:</h3>
                <p>
                  Please inform us of all regular medications (name and dose) and any known medical
                  conditions.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Travel Logistics:</h3>
                <p>
                  Book your return flight <span className="font-bold">with checked baggage</span>.
                  The provided aftercare shampoo and medical foam exceed 100ml and cannot be carried
                  in cabin luggage.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Attire:</h3>
                <p>
                  Wear loose, comfortable clothing with a wide neck or front zipper (e.g., a
                  button-down shirt) on the procedure day and following days to avoid contact with
                  the treated area.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Comfort Item:</h3>
                <p>
                  We highly recommend bringing a{' '}
                  <span className="font-bold">U-shaped travel pillow</span> for sleeping during the
                  initial recovery nights to support proper head elevation.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[14px] leading-tight text-primary uppercase">
              <span className="font-bold">4. PACKAGE SUMMARY &</span>
              <span className="block">FINANCIAL AGREEMENT</span>
            </h2>

            <div className="mt-4">
              <h3 className="mb-2 text-[11px] font-bold text-black">
                Your All-Inclusive Package Covers:
              </h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Hair Transplant procedure using the FUE technique.</li>
                <li>All private transfers (Airport ⇄ Hotel ⇄ Clinic).</li>
                <li>Dedicated interpreter services.</li>
                <li>3 nights at Crowne Plaza Istanbul Florya (5-star).</li>
                <li>All post-procedure medications.</li>
                <li>One (1) PRP session.</li>
                <li>Post-care kit (Shampoo & Foam Spray).</li>
              </ul>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={2} className="text-[10px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <div>
              <h3 className="mb-2 text-[12px] font-bold text-black">Financial Terms:</h3>
              <ul className="flex flex-col gap-y-1">
                <HideableText editKey="d3-p3-k1-h1">
                  <li>
                    <span className="font-bold">• Total Package Value: </span>
                    <EditableText editKey="d3-p3-k2-e1">{'$4,300'}</EditableText>
                  </li>
                </HideableText>

                <HideableText editKey="d3-p3-k3-h2">
                  <li>
                    <span className="font-bold">• Deposit Received: </span>
                    <EditableText editKey="d3-p3-k4-e2">{'€500 (Non-refundable)'}</EditableText>
                  </li>
                </HideableText>

                <HideableText editKey="d3-p3-k5-h3">
                  <li>
                    <span className="font-bold">• Outstanding Balance: </span>
                    <EditableText editKey="d3-p3-k6-e3">{'€3,800'}</EditableText>
                  </li>
                </HideableText>

                <HideableText editKey="d3-p3-k7-h4">
                  <li>
                    <span className="font-bold">• Balance Due Date: </span>
                    In full on the day of the procedure.
                  </li>
                </HideableText>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="mb-1 font-bold text-primary">■ Payment Details:</h3>
              <ul className="flex flex-col gap-y-2">
                <li>
                  <span className="font-bold">• Accepted Methods: </span>
                  Cash (EUR/USD/GBP), Major Cryptocurrencies, Debit/Credit Card, or Bank Transfer.
                </li>
                <li>
                  <span className="font-bold">• Important Note: </span>
                  Payments via card are subject to a mandatory{' '}
                  <span className="font-bold">10% VAT.</span>
                </li>
                <li>
                  <span className="font-bold">• Accepted Currencies: </span>
                  EUR, USD, GBP, CAD, AUD, CHF, TRY. *We cannot accept: Scottish/Irish Pounds,
                  old-series US banknotes, or €500 denominations.*
                </li>
                <li>
                  <span className="font-bold">• Prior to Travel: </span>
                  Please ensure your payment card is enabled for international transactions and has
                  a sufficient limit to cover the balance.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[14px] text-primary uppercase">
              <span className="font-bold">5. DEPOSIT & CANCELLATION POLICY</span>
            </h2>

            <p className="mb-4">
              Your €500 deposit secures your appointment and is non-refundable. However, it will
              remain valid for a future date under these specific conditions:
            </p>

            <div className="flex flex-col gap-y-3">
              <div>
                <h3 className="font-bold text-primary">■ Rescheduling:</h3>
                <p>
                  Written notice via WhatsApp at least <span className="font-bold">14 days</span>{' '}
                  prior to your original appointment.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Medical Emergency:</h3>
                <p>Provision of a verifiable medical certificate.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Flight Cancellation:</h3>
                <p>Provision of official airline documentation</p>
              </div>

              <p className="mt-2 text-black">
                Failure to provide the required notice or documentation within the 14-day window
                will result in the forfeiture of your deposit.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[14px] text-primary uppercase">
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
              <img src="/logo-x.svg" alt="Hair Of Istanbul" className="h-24 w-28" />

              <div className="border-l border-gray-200 py-4 pl-4 text-[16px] font-bold text-black">
                <EditableText seedText={user?.name} editKey="d3-p3-k8">
                  {'YOUR-NAME'}
                </EditableText>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Contact</h4>
                <EditableLink
                  seedValue={user?.phone}
                  editKey="d3-p3-k9"
                  href="tel:+90 532 650 00 00"
                  className="underline"
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
                <p className="whitespace-pre-line underline">
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
