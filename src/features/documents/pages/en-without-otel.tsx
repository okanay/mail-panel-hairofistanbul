import { useAuth } from '@/providers/auth'
import { EditableLink } from '../components/editable-link'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { HideableText } from '../components/hideable-text'
import { EditorMenu } from '../components/menu-editor'
import { EditableContainer } from '../components/editable-container'

export const WithoutOtelPageEN = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col bg-gray-50 text-black md:items-center md:justify-center">
      <EditorMenu />
      <EditablePage index={0} className="text-[10px] leading-relaxed">
        <header className="flex flex-col gap-y-1">
          <h1 className="font-semibold">
            Dear <EditableText editKey="d1-p1-k1">{'Mr. Customer-Name'}</EditableText>,
          </h1>

          <p>
            We hope this message finds you well. On behalf of the entire team at Hair of Istanbul,
            we are delighted to formally confirm your scheduled hair transplant procedure for{' '}
            <EditableText editKey="d1-p1-k2" className="font-bold">
              {'Tuesday, 28 July 1998'}
            </EditableText>
            .This email serves as your comprehensive appointment confirmation and guide. To ensure a
            seamless and successful experience, we kindly ask you to review the following
            information carefully.
          </p>
        </header>

        <article className="mt-6 flex flex-col gap-y-6">
          {/* SECTION 1: CRITICAL INFO (Aynen korundu) */}
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

          {/* SECTION 2: SCHEDULE (Otel bilgileri çıkarıldı, Day 2 buraya alındı) */}
          <section>
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">2. YOUR APPOINTMENT</span>
              <span className="block">SCHEDULE AND ITINERARY</span>
            </h2>

            <div className="mt-2 flex flex-col gap-y-4">
              {/* DAY 1 - OTELSİZ VERSİYON */}
              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Day 1: Arrival & Welcome </span>
                  {/* 3. Day 1 Tarihi Editlenebilir */}
                  <EditableText editKey="d2-p1-k3">{'(Thursday, 26 March 2026)'}</EditableText>
                </h2>
                <EditableContainer className="mt-2">
                  <p>
                    <EditableText editKey="d2-p1-k4" focusClassName="py-0 text-xs/6">
                      {`Our team will greet you at Istanbul Airport (IST), Gate 8, in front of Simit
                    Saray Café. A personal interpreter will provide a procedural overview and answer
                    any initial questions. Following this, you will be privately transferred to your
                    accommodation at the <b>5-star Crowne Plaza Istanbul Florya.</b>`}
                    </EditableText>
                  </p>
                </EditableContainer>
                {/* Otelsiz versiyon için özel uyarı notu */}
                <p className="mt-1 font-semibold text-black italic">
                  Please ensure you have made your own hotel arrangements for the duration of your
                  stay.
                </p>
              </div>

              {/* DAY 2 - BURAYA TAŞINDI (Çünkü yer açıldı) */}
              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Day 2: Procedure Day </span>
                  {/* 4. Day 2 Tarihi Editlenebilir */}
                  <EditableText editKey="d2-p1-k5">{'(Friday, 27 March 2026)'}</EditableText>
                </h2>
                <p>
                  You will be collected from your hotel and taken to our clinic. The day will
                  proceed as follows:
                </p>

                <div className="mt-2">
                  <div className="mb-1 flex flex-col gap-y-1">
                    <span className="font-bold text-primary">■ Pre-procedure checks: </span>
                    <span>ECG and comprehensive blood work.</span>
                  </div>
                  <div className="mb-1 flex flex-col gap-y-1">
                    <span className="font-bold text-primary">■ Consultation: </span>
                    <span>An in-depth discussion with our doctor.</span>
                  </div>
                  <div className="mb-1 flex flex-col gap-y-1">
                    <span className="font-bold text-primary">■ Design Session: </span>
                    <span>A custom hairline design created with our aesthetic team.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={1} className="text-[10px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          {/* Day 2 Detay Metni (Önceki sayfadan devam eden kısım) */}
          <section>
            <p>
              The procedure will only commence after satisfactory medical clearance and your final
              approval of the hairline design. It will be performed using the Follicular Unit
              Extraction (FUE) technique with micromotors under local anaesthesia, typically lasting
              6–8 hours. You will receive all necessary post-procedure medications and{' '}
              <span className="font-bold">one PRP session</span> as part of your package.
            </p>
          </section>

          {/* DAY 3 */}
          <section>
            <h2 className="text-[14px]">
              <span className="font-bold">Day 3: Post and Procedure Check </span>
              {/* Day 3 Tarihi Editlenebilir */}
              <EditableText editKey="d2-p1-k6">{'(Saturday, 28 March 2026)'}</EditableText>
            </h2>
            <p>
              You will return to the clinic for the removal of the donor area bandage and a progress
              evaluation by our medical team.
            </p>
          </section>

          {/* DAY 4 */}
          <section>
            <h2 className="text-[14px]">
              <span className="font-bold"> Day 4: Aftercare & Departure </span>
              {/* Day 4 Tarihi Editlenebilir */}
              <EditableText editKey="d2-p1-k7">{'(Sunday, 29 March 2026)'}</EditableText>
            </h2>
            <p>
              Your final visit includes your first professional hair wash and a detailed tutorial on
              your home-care routine. You will then be privately transferred to the airport
              approximately{' '}
              <span className="font-bold">3 hours before your scheduled departure.</span>
            </p>
          </section>

          {/* SECTION 3: PREPARATION */}
          <section>
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">3. ESSENTIAL PRE-PROCEDURE</span>
              <span className="block">PREPARATION</span>
            </h2>

            <p className="mt-2">
              Please adhere to these instructions to ensure optimal conditions for your procedure:
            </p>

            <div className="mt-3 flex flex-col gap-y-4">
              {/* Substance Abstinence */}
              <div>
                <h3 className="font-bold text-primary">■ Substance Abstinence:</h3>
                <p>
                  Refrain from consuming alcohol for <span className="font-bold">one week</span>{' '}
                  before the procedure, as it can thin the blood.
                </p>
              </div>

              {/* Medication Management */}
              <div>
                <h3 className="font-bold text-primary">■ Medication Management:</h3>
                <p>
                  Discontinue all blood-thinning medications (e.g., aspirin, ibuprofen) for{' '}
                  <span className="font-bold">one week</span> prior.
                </p>
              </div>

              {/* Important Box */}
              <div className="rounded-xs border border-primary bg-white p-2">
                <p>
                  <span className="font-bold">Important:</span> You must obtain approval from your
                  personal physician before stopping any prescribed medication.
                </p>
              </div>

              {/* Hair Preparation */}
              <div>
                <h3 className="font-bold text-primary">■ Hair Preparation:</h3>
                <p>
                  Do not cut, trim, or shave your hair (including the back and sides) for{' '}
                  <span className="font-bold">one month</span>
                  before your appointment. This allows for an accurate assessment and the best
                  possible hairline design.
                </p>
              </div>

              {/* Medical Disclosure */}
              <div>
                <h3 className="font-bold text-primary">■ Medical Disclosure:</h3>
                <p>
                  Please inform us of all regular medications (name and dose) and any known medical
                  conditions.
                </p>
              </div>

              {/* Travel Logistics */}
              <div>
                <h3 className="font-bold text-primary">■ Travel Logistics:</h3>
                <p>
                  Book your return flight <span className="font-bold">with checked baggage</span>.
                  The provided aftercare shampoo and medical foam exceed 100ml and cannot be carried
                  in cabin luggage.
                </p>
              </div>

              {/* Attire */}
              <div>
                <h3 className="font-bold text-primary">■ Attire:</h3>
                <p>
                  Wear loose, comfortable clothing with a wide neck or front zipper (e.g., a
                  button-down shirt) on the procedure day and following days to avoid contact with
                  the treated area.
                </p>
              </div>

              {/* Comfort Item */}
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
        </article>
      </EditablePage>

      <EditablePage index={2} className="text-[10px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          {/* SECTION 4: PACKAGE SUMMARY & FINANCIAL */}
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

            {/* FINANCIAL TERMS (EDITABLE AREA) */}
            <div className="mt-4">
              <h3 className="mb-2 text-[12px] font-bold text-black">Financial Terms:</h3>
              <ul className="flex flex-col gap-y-1">
                <HideableText editKey="d2-p3-k1-h1">
                  <li>
                    <span className="font-bold">• Total Package Value: </span>
                    <EditableText editKey="d2-p3-k2-e1">{'$4,300'}</EditableText>
                  </li>
                </HideableText>

                <HideableText editKey="d2-p3-k3-h2">
                  <li>
                    <span className="font-bold">• Deposit Received: </span>
                    <EditableText editKey="d2-p3-k4-e2">{'€500 (Non-refundable)'}</EditableText>
                  </li>
                </HideableText>

                <HideableText editKey="d2-p3-k5-h3">
                  <li>
                    <span className="font-bold">• Outstanding Balance: </span>
                    <EditableText editKey="d2-p3-k6-e3">{'€3,800'}</EditableText>
                  </li>
                </HideableText>

                <HideableText editKey="d2-p3-k7-h4">
                  <li>
                    <span className="font-bold">• Balance Due Date: </span>
                    In full on the day of the procedure.
                  </li>
                </HideableText>
              </ul>
            </div>

            {/* PAYMENT DETAILS */}
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

          {/* SECTION 5: DEPOSIT & CANCELLATION */}
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
        </article>
      </EditablePage>

      <EditablePage index={3} className="text-[10px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          {/* SECTION 6: FINAL STEPS */}
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

          {/* SIGNATURE & FOOTER */}
          <section>
            <div className="flex items-center gap-x-4">
              {/* Logo */}
              <img src="/logo-x.svg" alt="Hair Of Istanbul" className="h-24 w-28" />

              {/* EDITABLE SIGNATURE NAME */}
              <div className="border-l border-gray-200 py-4 pl-4 text-[16px] font-bold text-black">
                <EditableText seedText={user?.name} editKey="d2-p3-k8">
                  {'YOUR-NAME'}
                </EditableText>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-8 border-t border-gray-200 pt-6">
              {/* Contact Column */}
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Contact</h4>

                {/* Editable Phone */}
                <EditableLink
                  seedValue={user?.phone}
                  editKey="d2-p3-k9"
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
