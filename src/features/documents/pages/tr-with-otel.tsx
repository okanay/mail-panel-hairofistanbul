import { useAuth } from '@/providers/auth'
import { EditableContainer } from '../components/editable-container'
import { EditableHide } from '../components/editable-hide'
import { EditableLink } from '../components/editable-link'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { EditorMenu } from '../components/menu-editor'
import { useField } from '../hooks/use-field'
import { SquareBullet } from '../components/icon-square'

export const WithOtelPageTR = () => {
  const { user } = useAuth()

  const formData = [
    // --- PAGE : 1 ---
    {
      name: 'Müşteri Adı',
      editKey: 'p1-customer-name',
      defaultValue: 'Sayın Breuer',
      inputMode: 'text',
    },
    {
      name: 'Operasyon Tarihi (Giriş)',
      editKey: 'p1-proc-date-main',
      defaultValue: 'Cuma, 27 Mart 2026',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Tarih',
      editKey: 'p1-day1-date',
      defaultValue: 'Perşembe, 26 Mart 2026',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Karşılama Metni',
      description: 'HTML (b, i) kullanılabilir. Kapı numarası vb. için.',
      editKey: 'p1-day1-text',
      defaultValue: `Ekibimiz sizi İstanbul Havalimanı (IST), 8. Kapı, Simit Saray Café önünde karşılayacaktır. Kişisel tercümanınız size prosedür hakkında genel bir bilgi verecek ve ilk sorularınızı yanıtlayacaktır. Ardından, özel transfer aracınızla konaklayacağınız <b>5 yıldızlı Crowne Plaza İstanbul Florya</b> oteline transferiniz gerçekleştirilecektir.`,
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
        '3 gece konaklama, günlük kahvaltı; spa, fitness merkezi, yüzme havuzu, Türk Hamamı ve sauna kullanımı.',
      inputMode: 'text',
    },
    {
      name: 'Dahil Olmayanlar',
      editKey: 'p2-exclusions',
      defaultValue: 'Minibar, masaj, çamaşırhane, oda servisi ve diğer ekstra harcamalar.',
      inputMode: 'text',
    },
    {
      name: 'Ekstra Konaklama Bilgisi',
      editKey: 'p2-extended-stays',
      description: 'Fiyatlar ve koşullar',
      defaultValue: `Ekstra geceler, <b>tek kişilik konaklama için gecelik €135</b> ve <b>çift kişilik konaklama için gecelik €160</b> olarak ücretlendirilir ve ödemesi tarafınızca doğrudan yapılır.`,
      inputMode: 'textarea',
    },
    {
      name: '2. Gün: Operasyon Tarihi',
      editKey: 'p2-day2-date',
      defaultValue: '( Perşembe, 26 Mart 2026 )',
      inputMode: 'text',
    },
    {
      name: '3. Gün: Kontrol Tarihi',
      editKey: 'p2-day3-date',
      defaultValue: '( Cumartesi, 28 Mart 2026 )',
      inputMode: 'text',
    },
    {
      name: '4. Gün: Ayrılış Tarihi',
      editKey: 'p2-day4-date',
      defaultValue: '( Pazar, 29 Mart 2026 )',
      inputMode: 'text',
    },
    // --- PAGE : 3 ---
    {
      name: 'Otel Bilgisi (Paket İçeriği)',
      editKey: 'p3-hotel-info',
      defaultValue: 'Crowne Plaza İstanbul Florya’da (5 Yıldız) 3 gece konaklama.',
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
      defaultValue: '€500 (İade Edilemez)',
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
      defaultValue: 'Tamamı operasyon gününde ödenmelidir.',
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
        <article className="flex flex-col gap-y-8">
          {/* --- GREETING SECTION --- */}
          <section className="flex flex-col gap-y-2">
            <h1 className="text-[15px] font-bold text-black">
              Sayın <EditableText field={f('p1-customer-name')} />,
            </h1>
            <p className="text-justify">
              Bu mesajın size sağlık ve iyilik getirmesini dileriz. Hair of Istanbul ekibi adına,{' '}
              <EditableText field={f('p1-proc-date-main')} className="font-bold" /> tarihindeki saç
              ekimi operasyonunuzu resmi olarak onaylamaktan mutluluk duyuyoruz. Bu belge, kapsamlı
              randevu onayınız ve rehberiniz niteliğindedir. Kusursuz ve başarılı bir deneyim için
              aşağıdaki bilgileri dikkatlice incelemenizi rica ederiz.
            </p>
          </section>

          {/* --- SECTION 1: MEDICAL INFO --- */}
          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary">
              <span className="font-bold">1. KRİTİK TIBBİ BİLGİLER</span>
              <span className="block">& BEYANLAR</span>
            </h2>

            <div className="flex flex-col gap-y-5">
              {/* Item 1 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Operasyon Öncesi Tarama
                </h3>
                <p>
                  Operasyon gününde kliniğimizde zorunlu HIV ve Hepatit B/C kan testleri
                  yapılacaktır. Herhangi bir testin pozitif çıkması durumunda, üzülerek belirtmek
                  isteriz ki operasyonu gerçekleştirmemiz mümkün olmayacaktır.
                </p>
              </div>

              {/* Item 2 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Operasyon Engelleri (Kontrendikasyonlar):
                </h3>
                <p>
                  Epilepsi geçmişiniz, keloid skarlaşma, sedef hastalığı, folikülit (vücudunuzun
                  herhangi bir yerinde) veya Diyabetiniz varsa,{' '}
                  <span className="font-bold text-black">
                    lütfen en kısa sürede müşteri temsilcinizle iletişime geçiniz.
                  </span>{' '}
                  Bu durumlar özel bir tıbbi inceleme gerektirir ve operasyonun yapılmasına engel
                  olabilir.
                </p>
              </div>

              {/* Item 3 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Zorunlu Tıbbi Beyan:
                </h3>
                <p className="mb-2">
                  Aşağıdaki gibi başka herhangi bir kronik tıbbi durumunuz varsa, WhatsApp üzerinden
                  özel müşteri temsilcinizi bilgilendirmeniz gerekmektedir:
                </p>
                <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                  <li>Kalp hastalığı</li>
                  <li>Yüksek tansiyon</li>
                  <li>Egzama veya seboreik dermatit</li>
                  <li>
                    Veya düzenli olarak reçeteli ya da reçetesiz herhangi bir ilaç kullanıyorsanız.
                  </li>
                </ul>
              </div>

              {/* Item 4 */}
              <div>
                <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Olası Erteleme:
                </h3>
                <p>
                  Donör veya ekim yapılacak bölgelerde aktif egzama veya seboreik dermatit mevcutsa,
                  cildin tamamen iyileşmesi için operasyonun 3–5 gün ertelenmesi gerekebilir. Böyle
                  bir durumda, uçuşunuzun yeniden planlanması ve otel konaklamanızın uzatılmasıyla
                  ilgili tüm masraflar tarafınıza ait olacaktır.
                </p>
              </div>
            </div>
          </section>

          {/* --- SECTION 2: ITINERARY --- */}
          <section>
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">2. RANDEVU PROGRAMINIZ</span>
              <span className="block">VE SEYAHAT PLANINIZ</span>
            </h2>

            <div className="flex flex-col gap-y-4">
              {/* Day 1 Detail */}
              <div>
                <h3 className="mb-2 text-[16px] text-black">
                  <span className="font-bold">1. Gün: Varış & Karşılama </span>
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
                    <SquareBullet /> Otel Adresi:
                  </h4>
                  <p>
                    <EditableText field={f('p1-hotel-address')} />
                  </p>
                </div>

                <div>
                  <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                    <SquareBullet /> Web Adresi:
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
          <section className="flex flex-col gap-y-4">
            {/* Inclusions */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Paket Dahilindekiler:
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
                <SquareBullet /> Dahil Olmayanlar:
              </h3>
              <p>
                <EditableText field={f('p2-exclusions')} focusClassName="py-0 text-[14px]/4" />
              </p>
            </div>

            {/* Extended Stays */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Ekstra Konaklama:
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
              <span className="font-bold">2. Gün: Operasyon Günü </span>
              <EditableText field={f('p2-day2-date')} className="font-custom-commuters" />
            </h3>

            <p className="mb-4">
              Otelinizden alınıp kliniğimize getirileceksiniz. Günün akışı şu şekilde olacaktır:
            </p>

            <div className="mb-4 flex flex-col gap-y-4">
              <div>
                <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Operasyon öncesi kontroller:
                </h4>
                <p>EKG ve kapsamlı kan tahlilleri.</p>
              </div>

              <div>
                <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Konsültasyon:
                </h4>
                <p>Doktorumuzla detaylı görüşme.</p>
              </div>

              <div>
                <h4 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                  <SquareBullet /> Tasarım Seansı:
                </h4>
                <p>Estetik ekibimizle oluşturulan kişiye özel saç çizgisi tasarımı.</p>
              </div>
            </div>

            <p className="text-justify">
              Operasyon, ancak tatmin edici tıbbi onay ve saç çizgisi tasarımına vereceğiniz son
              onaydan sonra başlayacaktır. İşlem, lokal anestezi altında mikromotorlar ile Foliküler
              Ünite Ekstraksiyonu (FUE) tekniği kullanılarak gerçekleştirilecek olup, genellikle 6-8
              saat sürmektedir. Paketinizin bir parçası olarak gerekli tüm operasyon sonrası ilaçlar
              ve <span className="font-bold">bir seans PRP</span> tarafınıza sağlanacaktır.
            </p>
          </section>

          {/* --- SECTION: DAY 3 CHECK --- */}
          <section>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">3. Gün: Operasyon Sonrası Kontrol </span>
              <EditableText field={f('p2-day3-date')} className="font-custom-commuters" />
            </h3>
            <p>
              Donör bölge bandajının çıkarılması ve tıbbi ekibimiz tarafından yapılacak durum
              değerlendirmesi için kliniğe tekrar geleceksiniz.
            </p>
          </section>

          {/* --- SECTION: DAY 4 DEPARTURE --- */}
          <section>
            <h3 className="mb-2 text-[16px] text-black">
              <span className="font-bold">4. Gün: Bakım & Ayrılış </span>
              <EditableText field={f('p2-day4-date')} className="font-custom-commuters" />
            </h3>
            <p className="text-justify">
              Son ziyaretinizde ilk profesyonel saç yıkamanız gerçekleştirilecek ve evde bakım
              rutininiz hakkında detaylı bir eğitim verilecektir. Ardından,{' '}
              <span className="font-bold">planlanan uçuş saatinizden yaklaşık 3 saat önce</span>{' '}
              özel araçla havalimanına transferiniz sağlanacaktır.
            </p>
          </section>

          {/* --- SECTION 3: PREPARATION --- */}
          <section className="mt-2">
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">3. OPERASYON ÖNCESİ</span>
              <span className="block">TEMEL HAZIRLIKLAR</span>
            </h2>

            <p className="mb-4">
              Operasyonunuz için en uygun koşulları sağlamak adına lütfen bu talimatlara uyunuz:
            </p>

            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Madde Kullanımı:
              </h3>
              <p>
                Kanı sulandırabileceği için operasyondan{' '}
                <span className="font-bold">bir hafta</span> önce alkol tüketimini bırakınız.
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
            {/* Medication Management & Box */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> İlaç Yönetimi:
              </h3>
              <p className="mb-3">
                Kan sulandırıcı ilaçları (örn. aspirin, ibuprofen){' '}
                <span className="font-bold">bir hafta</span> önceden kesiniz.
              </p>

              {/* Important Box */}
              <div className="border border-primary/60 p-3">
                <p className="leading-snug">
                  <span className="font-bold">Önemli:</span> Reçeteli herhangi bir ilacı bırakmadan
                  önce mutlaka kendi doktorunuzdan onay almalısınız.
                </p>
              </div>
            </div>

            {/* Hair Preparation */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Saç Hazırlığı:
              </h3>
              <p>
                Randevunuzdan bir ay önce saçınızı (arka ve yanlar dahil) kestirmeyiniz,
                kısaltmayınız veya tıraş etmeyiniz. Bu, doğru bir değerlendirme ve mümkün olan en
                iyi saç çizgisi tasarımı için gereklidir.
              </p>
            </div>

            {/* Medical Disclosure */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Tıbbi Beyan:
              </h3>
              <p>
                Lütfen düzenli kullandığınız tüm ilaçları (isim ve dozaj) ve bilinen tıbbi
                durumlarınızı bize bildiriniz.
              </p>
            </div>

            {/* Travel Logistics */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Seyahat Lojistiği:
              </h3>
              <p>
                Dönüş uçuşunuzu bagajlı olarak ayırtınız. Size verilecek olan bakım şampuanı ve
                medikal köpük 100 ml’yi aştığı için kabin bagajında taşınamaz.
              </p>
            </div>

            {/* Attire */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Kıyafet:
              </h3>
              <p>
                İşlem yapılan bölgeye teması önlemek için operasyon günü ve sonraki günlerde geniş
                yakalı veya önden fermuarlı/düğmeli (örn. gömlek) rahat kıyafetler giyiniz.
              </p>
            </div>

            {/* Comfort Item */}
            <div>
              <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                <SquareBullet /> Konfor Ürünü:
              </h3>
              <p>
                İlk iyileşme gecelerinde başınızı doğru pozisyonda tutabilmeniz ve rahat
                uyuyabilmeniz için U-şekilli bir seyahat yastığı getirmenizi şiddetle tavsiye
                ederiz.
              </p>
            </div>
          </section>

          {/* --- SECTION 4: PACKAGE SUMMARY & FINANCIAL --- */}
          <section className="mt-2">
            <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
              <span className="font-bold">4. PAKET ÖZETİ &</span>
              <span className="block">FİNANSAL SÖZLEŞME</span>
            </h2>

            {/* Inclusions List */}
            <div className="mb-5">
              <h3 className="mb-2 font-bold text-black">Her Şey Dahil Paketiniz Şunları Kapsar:</h3>
              <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                <li>FUE tekniği kullanılarak Saç Ekimi işlemi.</li>
                <li>Tüm özel transferler (Havalimanı ⇄ Otel ⇄ Klinik).</li>
                <li>Özel tercümanlık hizmetleri.</li>
                <li>
                  {/* Editable Hotel Info */}
                  <EditableText field={f('p3-hotel-info')} />
                </li>
                <li>Tüm operasyon sonrası ilaçlar.</li>
                <li>Bir (1) seans PRP.</li>
                <li>Operasyon sonrası bakım kiti (Şampuan & Köpük Sprey).</li>
              </ul>
            </div>

            {/* Financial Terms (Hideable Areas) */}
            <div>
              <h3 className="mb-2 font-bold text-black">Finansal Şartlar:</h3>
              <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                {/* Total Value */}
                <EditableHide editKey={f('p3-finance-total-hide').editKey}>
                  <li>
                    <span className="font-bold">Toplam Paket Değeri: </span>
                    <EditableText field={f('p3-finance-total-val')} />
                  </li>
                </EditableHide>

                {/* Deposit */}
                <EditableHide editKey={f('p3-finance-deposit-hide').editKey}>
                  <li>
                    <span className="font-bold">Alınan Depozito: </span>
                    <EditableText field={f('p3-finance-deposit-val')} />
                  </li>
                </EditableHide>

                {/* Outstanding Balance */}
                <EditableHide editKey={f('p3-finance-balance-hide').editKey}>
                  <li>
                    <span className="font-bold">Kalan Bakiye: </span>
                    <EditableText field={f('p3-finance-balance-val')} />
                  </li>
                </EditableHide>

                {/* Due Date */}
                <EditableHide editKey={f('p3-finance-duedate-hide').editKey}>
                  <li>
                    <span className="font-bold">Bakiye Ödeme Tarihi: </span>
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
                <SquareBullet /> Ödeme Detayları:
              </h4>
              <ul className="ml-4 flex list-disc flex-col gap-y-1.5 pl-2">
                <li>
                  <p>
                    <span className="font-bold">Kabul Edilen Yöntemler: </span>
                    Nakit (EUR/USD/GBP), Kripto Para, Banka/Kredi Kartı veya Banka Havalesi.
                  </p>
                </li>
                <li>
                  <p>
                    <span className="font-bold">Önemli Not: </span>
                    Kart ile yapılan ödemelerde zorunlu <span className="font-bold">
                      %10 KDV
                    </span>{' '}
                    uygulanmaktadır.
                  </p>
                </li>
                <li>
                  <p>
                    <span className="font-bold">Kabul Edilen Para Birimleri: </span>
                    EUR, USD, GBP, CAD, AUD, CHF, TRY. *İskoç/İrlanda Sterlini, eski seri ABD
                    banknotları veya 500€ banknotları kabul edilmemektedir.*
                  </p>
                </li>
                <li>
                  <p>
                    <span className="font-bold">Seyahat Öncesi: </span>
                    Lütfen ödeme kartınızın uluslararası işlemlere açık olduğundan ve bakiyeyi
                    karşılayacak yeterli limite sahip olduğundan emin olunuz.
                  </p>
                </li>
              </ul>
            </section>

            {/* --- SECTION 5: DEPOSIT & CANCELLATION --- */}
            <section>
              <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
                <span className="font-bold">5. DEPOZİTO & İPTAL POLİTİKASI</span>
              </h2>

              <p className="mb-4">
                500€ tutarındaki depozitonuz randevunuzu garanti altına alır ve iade edilemez.
                Ancak, aşağıdaki belirli koşullar altında ileri bir tarih için geçerliliğini korur:
              </p>

              <div className="flex flex-col gap-y-4">
                <div>
                  <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                    <SquareBullet /> Yeniden Planlama:
                  </h3>
                  <p>
                    Orijinal randevunuzdan en az 14 gün önce WhatsApp üzerinden yazılı bildirim
                    yapılması.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                    <SquareBullet /> Acil Tıbbi Durum:
                  </h3>
                  <p>Doğrulanabilir bir tıbbi rapor sunulması.</p>
                </div>

                <div>
                  <h3 className="mb-1 flex items-center gap-x-1.5 font-bold text-primary-heavy">
                    <SquareBullet /> Uçuş İptali:
                  </h3>
                  <p>Resmi havayolu belgelerinin sunulması.</p>
                </div>

                <p className="mt-2 text-black">
                  14 günlük süre içinde gerekli bildirimin yapılmaması veya belgelerin sunulmaması
                  durumunda depozitonuz yanacaktır.
                </p>
              </div>
            </section>

            {/* --- SECTION 6: FINAL STEPS --- */}
            <section>
              <h2 className="mb-4 font-custom-commuters text-[22px] leading-tight text-primary uppercase">
                <span className="font-bold">6. SON ADIMLAR & İLETİŞİM</span>
                <span className="block">BİLGİLERİ</span>
              </h2>

              <div className="flex flex-col gap-y-2">
                <p>
                  Yolculuğunuzdan önce herhangi bir sorunuz olursa, size yardımcı olmak için
                  buradayız. Size olağanüstü bir deneyim ve mükemmel sonuçlar sunmaya kararlıyız.
                  Sizi İstanbul’da ağırlamayı dört gözle bekliyoruz. <b>En içten dileklerimizle,</b>
                </p>
              </div>
            </section>
          </div>

          {/* --- FOOTER SECTION --- */}
          <section className="mt-10">
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
                <h4 className="mb-1 font-bold text-black">İletişim</h4>
                <EditableLink
                  editKey={f('p4-rep-phone').editKey}
                  defaultValue={f('p4-rep-phone').defaultValue}
                  seedValue={f('p4-rep-phone').seedValue}
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
                <h4 className="mb-1 font-bold text-black">Adres</h4>
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
