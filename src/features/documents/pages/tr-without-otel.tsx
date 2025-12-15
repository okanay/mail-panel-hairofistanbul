import { useAuth } from '@/providers/auth'
import { EditableContainer } from '../components/editable-container'
import { EditableHide } from '../components/editable-hide'
import { EditableLink } from '../components/editable-link'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { EditorMenu } from '../components/menu-editor'
import { useField } from '../hooks/use-field'

export const WithoutOtelPageTR = () => {
  const { user } = useAuth()

  const formData = [
    {
      name: 'Müşteri Adı',
      editKey: 'd2-p1-k1',
      defaultValue: 'MÜŞTERİ-ADI',
      inputMode: 'text',
    },
    {
      name: 'Operasyon Tarihi (Ana)',
      editKey: 'd2-p1-k2',
      defaultValue: 'Salı, 28 Temmuz 1998',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Varış Tarihi',
      editKey: 'd2-p1-k3',
      defaultValue: '(Perşembe, 26 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: '1. Gün: Karşılama Metni',
      description: 'HTML etiketleri (b, i, u vb.) kullanılabilir.',
      editKey: 'd2-p1-k4',
      defaultValue: `Ekibimiz sizi İstanbul Havalimanı (IST) Kapı 8'de, Simit Saray Café'nin önünde karşılayacaktır. Kişisel bir tercüman, işlem hakkında bilgi verecek ve ilk sorularınızı cevaplayacaktır.`,
      inputMode: 'textarea',
    },
    {
      name: '2. Gün: Operasyon Tarihi',
      editKey: 'd2-p1-k5',
      defaultValue: '(Cuma, 27 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: '3. Gün: Kontrol Tarihi',
      editKey: 'd2-p1-k6',
      defaultValue: '(Cumartesi, 28 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: '4. Gün: Ayrılış Tarihi',
      editKey: 'd2-p1-k7',
      defaultValue: '(Pazar, 29 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: 'Toplam Paket Değeri',
      editKey: 'd2-p3-f1-e1',
      defaultValue: '$4,300',
      inputMode: 'text',
    },
    {
      name: 'Toplamı Gizle',
      editKey: 'd2-p3-f1-h1',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Depozito Miktarı',
      editKey: 'd2-p3-f2-e2',
      defaultValue: '€500 (Non-refundable)',
      inputMode: 'text',
    },
    {
      name: 'Depozitoyu Gizle',
      editKey: 'd2-p3-f2-h2',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Kalan Bakiye',
      editKey: 'd2-p3-f3-e3',
      defaultValue: '€3,800',
      inputMode: 'text',
    },
    {
      name: 'Bakiyeyi Gizle',
      editKey: 'd2-p3-f3-h3',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Son Ödeme Tarihi Hakkında',
      editKey: 'd2-p3-f4-e4',
      defaultValue: 'İşlem günü, ödemenin tamamı yapılmalıdır.',
      inputMode: 'text',
    },
    {
      name: 'Son Ödeme Tarihini Gizle',
      editKey: 'd2-p3-f4-h4',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Temsilci Adı',
      editKey: 'd2-p3-k8',
      defaultValue: 'AD-SOYAD',
      seedValue: user?.name,
      inputMode: 'text',
    },
    {
      name: 'Temsilci Telefonu',
      editKey: 'd2-p3-k9',
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
  ] as const satisfies FormFieldConfig[]

  const f = useField(formData)

  return (
    <main className="flex flex-col bg-stone-50 text-black md:items-center md:justify-center">
      <EditorMenu formData={formData} />
      <EditablePage index={0} className="text-[10.5px] leading-relaxed">
        <header className="flex flex-col gap-y-1">
          <h1 className="font-semibold">
            Sayın <EditableText field={f('d2-p1-k1')} className="font-bold" />,
          </h1>

          <p>
            Hair of İstanbul ailesinin tamamı adına, saç nakli işleminizin{' '}
            <EditableText field={f('d2-p1-k2')} className="font-bold" /> tarihine planlandığını
            resmi olarak onaylamaktan mutluluk duyuyoruz. Bu belge, randevunuzun kapsamı ve rehberi
            niteliğindedir. Sorunsuz ve başarılı bir deneyim sağlamak için, lütfen aşağıdaki
            bilgileri dikkatle incelemenizi rica ediyoruz.
          </p>
        </header>

        <article className="mt-6 flex flex-col gap-y-6">
          <section>
            <h2 className="font-custom-commuters text-[14px] text-primary">
              <span className="font-bold">1. KRİTİK TIBBİ BİLGİ</span>
              <span className="block">VE AÇIKLAMALAR</span>
            </h2>

            <p className="my-2">
              Güvenliğiniz bizim için en yüksek önceliktir. Lütfen aşağıdaki zorunlu koşulları
              dikkate alınız:
            </p>

            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Operasyon
                  Öncesi Tarama
                </h3>
                <p>
                  İşlem günü kliniğimizde zorunlu HIV ve Hepatit B/C kan testleri yapılacaktır. Her
                  iki hastalıktan birinin pozitif sonucu çıkması, maalesef işlemin yapılmasını
                  engelleyecektir.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> İşlem
                  Kontrendikasyonları:
                </h3>
                <p>
                  Epilepsi öyküsü, keloid yara izleri (vücudunuzun herhangi bir yerinde) veya
                  Diyabet tanısına sahipseniz,{' '}
                  <span className="font-bold">
                    lütfen müşteri temsilcinizle en kısa sürede iletişime geçiniz.
                  </span>{' '}
                  Bu durumlar özel tıbbi inceleme gerektirir ve işlemin yapılmasını engelleyebilir.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Gerekli
                  Tıbbi Açıklama:
                </h3>
                <p>
                  Herhangi bir kronik hastalık durumunda, lütfen WhatsApp aracılığıyla adanmış
                  müşteri temsilcinize bilgi vermeniz gerekmektedir:
                </p>
                <ul className="ml-4 list-disc">
                  <li>Kalp hastalığı</li>
                  <li>Yüksek tansiyon</li>
                  <li>Egzama veya seboreik dermatit</li>
                  <li>
                    Veya düzenli olarak kullanmakta olduğunuz reçeteli veya reçetesiz ilaçlar.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Olası
                  Erteleme:
                </h3>
                <p>
                  Donor veya alıcı bölgede aktif egzama veya seboreik dermatit varsa, işlemin 3–5
                  gün ertelenmesi gerekebilir ve cildinin tamamen iyileşmesine izin verilmelidir. Bu
                  durumda, uçuş değişikliği ve otel konaklamasının uzatılması ile ilgili tüm
                  masraflardan siz sorumlu olacaksınız.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-custom-commuters text-[14px] text-primary">
              <span className="font-bold">2. RANDEVUNUZ</span>
              <span className="block">PROGRAM VE GÜZERGAH</span>
            </h2>

            <div className="mt-2 flex flex-col gap-y-4">
              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Gün 1: Varış ve Karşılama </span>
                  <EditableText field={f('d2-p1-k3')} />
                </h2>
                <EditableContainer className="mt-2">
                  <p>
                    <EditableText field={f('d2-p1-k4')} focusClassName="py-0 text-xs/6" />
                  </p>
                </EditableContainer>
                <p className="mt-1 font-semibold text-black italic">
                  Lütfen konaklama süreniz boyunca otel ayırımını kendi yapınız.
                </p>
              </div>

              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Gün 2: Operasyon Günü </span>
                  <EditableText field={f('d2-p1-k5')} />
                </h2>
                <p>
                  Otelinizdeki odanızdan alınarak kliniğimize götürüleceksiniz. Gün aşağıdaki
                  şekilde ilerleyecektir:
                </p>

                <div className="mt-2">
                  <div className="mb-1 flex flex-col gap-y-1">
                    <span className="font-bold text-primary">
                      <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                      Operasyon öncesi kontroller:{' '}
                    </span>
                    <span>EKG ve kapsamlı kan testi.</span>
                  </div>
                  <div className="mb-1 flex flex-col gap-y-1">
                    <span className="font-bold text-primary">
                      <span className="inline-flex -translate-y-[1.5px] scale-110">■</span>{' '}
                      Danışmanlık:{' '}
                    </span>
                    <span>Doktorumuzla derinlemesine bir görüşme.</span>
                  </div>
                  <div className="mb-1 flex flex-col gap-y-1">
                    <span className="font-bold text-primary">
                      <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Tasarım
                      Oturumu:{' '}
                    </span>
                    <span>Estetik ekibimiz tarafından özel saç çizgisi tasarımı.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={1} className="text-[10.5px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <p>
              İşlem, yeterli tıbbi izin ve saç çizgisi tasarımınız için son onayınız alındıktan
              sonra başlayacaktır. İşlem, Foliküler Ünite Ekstraksiyon (FUE) tekniği kullanılarak
              lokal anestezi altında yapılacak ve genellikle 6–8 saat sürecektir. Paketinizin bir
              parçası olarak gerekli operasyon sonrası tüm ilaçları ve{' '}
              <span className="font-bold">bir PRP seansı</span> alacaksınız.
            </p>
          </section>

          <section>
            <h2 className="text-[14px]">
              <span className="font-bold">Gün 3: Operasyon Sonrası Kontrol </span>
              <EditableText field={f('d2-p1-k6')} />
            </h2>
            <p>
              Klinik kontrol için geri döneceksiniz. Donor bölgesindeki bandajın çıkarılması ve
              tıbbi ekibimiz tarafından ilerlemenin değerlendirilmesi yapılacaktır.
            </p>
          </section>

          <section>
            <h2 className="text-[14px]">
              <span className="font-bold"> Gün 4: Bakım ve Ayrılış </span>
              <EditableText field={f('d2-p1-k7')} />
            </h2>
            <p>
              Son ziyaretinizde profesyonel saç yıkama ve ev bakım rutininiz hakkında ayrıntılı bir
              eğitim alacaksınız. Ardından, planlanan kalkış saatinizden yaklaşık{' '}
              <span className="font-bold">
                3 saat önce havalimanına özel transfer yapılacaktır.
              </span>
            </p>
          </section>

          <section>
            <h2 className="font-custom-commuters text-[14px] text-primary">
              <span className="font-bold">3. OPERASYON ÖNCESİ</span>
              <span className="block">HAZIRLIK TÜRLERİ</span>
            </h2>

            <p className="mt-2">
              İşleminiz için optimal koşullar sağlamak amacıyla lütfen bu talimatlar doğrultusunda
              hareket ediniz:
            </p>

            <div className="mt-3 flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Madde
                  Kullanımı Abstinansı:
                </h3>
                <p>
                  İşlemden <span className="font-bold">bir hafta</span> önce alkol tüketiminden
                  kaçının, çünkü kanı seyreltebilir.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> İlaç
                  Yönetimi:
                </h3>
                <p>
                  Tüm kan sulandırıcı ilaçları (örneğin aspirin, ibuprofen) önceki{' '}
                  <span className="font-bold">bir hafta</span> boyunca kesiniz.
                </p>
              </div>

              <div className="rounded-xs border border-primary bg-white p-2">
                <p>
                  <span className="font-bold">Önemli:</span> Herhangi bir reçeteli ilacı kesmeden
                  önce kişisel doktorunuzdan onay almanız gereklidir.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Saç
                  Hazırlığı:
                </h3>
                <p>
                  Randevunuzdan bir ay öncesine kadar saçınızı (arka ve yanları da dahil) kesmeyin,
                  kesmez veya traş etmeyin. <span className="font-bold">bir ay</span>
                  Doğru bir değerlendirmeye ve en iyi saç çizgisi tasarımına olanak tanır.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Tıbbi
                  Açıklama:
                </h3>
                <p>
                  Lütfen tüm düzenli ilaçlarınızı (adı ve dozu) ve bilinen tıbbi koşullarınızı bize
                  bilgilendiriniz.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Seyahat
                  Lojistiği:
                </h3>
                <p>
                  Dönüş uçuşunuzu <span className="font-bold">kontrol bagajı ile</span> rezerve
                  ediniz. Sağlanan bakım şampuanı ve tıbbi köpük 100ml'i aşarken kabin bagajında
                  taşınamaz.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Kıyafet:
                </h3>
                <p>
                  İşlem günü ve takip eden günlerde geniş, rahat kıyafet giyin. Geniş yaka veya ön
                  fermuarlı (örneğin, cepli gömlek) ve işlenen alanla temas etmeyin.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Rahatlık
                  Eşyası:
                </h3>
                <p>
                  İlk iyileşme gecelerinde başın düzgün şekilde yükseltilmesini desteklemek için
                  <span className="font-bold">U şeklinde bir seyahat yastığı</span> getirmenizi
                  şiddetle tavsiye ederiz.
                </p>
              </div>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={2} className="text-[10.5px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <h2 className="font-custom-commuters text-[14px] text-primary uppercase">
              <span className="font-bold">4. PAKET ÖZETİ VE</span>
              <span className="block">FİNANSAL ANLAŞMA</span>
            </h2>

            <div className="mt-4">
              <h3 className="mb-2 font-bold text-black">Paketiniz Dahilindeki Hizmetler:</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>FUE tekniği kullanılarak Saç Nakli işlemi.</li>
                <li>Tüm özel transferler (Havalimanı ⇄ Otel ⇄ Klinik).</li>
                <li>Profesyonel tercüman hizmeti.</li>
                <li>Tüm operasyon sonrası ilaçlar.</li>
                <li>Bir (1) PRP seansı.</li>
                <li>Bakım kiti (Şampuan ve Köpük Spreyi).</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-bold text-black">Finansal Şartlar:</h3>
              <ul className="ml-4 list-disc space-y-1">
                <EditableHide editKey={f('d2-p3-f1-h1').editKey}>
                  <li>
                    <span className="font-bold">Toplam Paket Değeri: </span>
                    <EditableText field={f('d2-p3-f1-e1')} />
                  </li>
                </EditableHide>

                <li>
                  <EditableHide editKey={f('d2-p3-f2-h2').editKey}>
                    <span className="font-bold">Alınan Depozito: </span>
                    <EditableText field={f('d2-p3-f2-e2')} />
                  </EditableHide>
                </li>

                <EditableHide editKey={f('d2-p3-f3-h3').editKey}>
                  <li>
                    <span className="font-bold">Kalan Bakiye: </span>
                    <EditableText field={f('d2-p3-f3-e3')} />
                  </li>
                </EditableHide>

                <EditableHide editKey={f('d2-p3-f4-h4').editKey}>
                  <li>
                    <span className="font-bold">Son Ödeme Tarihi: </span>
                    <EditableText field={f('d2-p3-f4-e4')} />
                  </li>
                </EditableHide>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-bold text-black">Ödeme Detayları:</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  <span className="font-bold">Kabul Edilen Yöntemler: </span>
                  Nakit (EUR/USD/GBP), Başlıca Kripto Paralar, Banka/Kredi Kartı veya Banka
                  Transferi.
                </li>
                <li>
                  <span className="font-bold">Önemli Not: </span>
                  Kart aracılığıyla yapılan ödemeler zorunlu{' '}
                  <span className="font-bold">%10 KDV</span> uygulamasına tabidir.
                </li>
                <li>
                  <span className="font-bold">Kabul Edilen Para Birimleri: </span>
                  EUR, USD, GBP, CAD, AUD, CHF, TRY. *Kabul edemiyoruz: İskoç/İrlanda Sterlini, eski
                  dizi ABD banknotları veya €500 değerleri.*
                </li>
                <li>
                  <span className="font-bold">Seyahat Öncesi: </span>
                  Lütfen ödeme kartınızın uluslararası işlemler için etkinleştirildiğinden ve
                  bakiyeyi karşılamak için yeterli limitinin olduğundan emin olunuz.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-custom-commuters text-[14px] text-primary uppercase">
              <span className="font-bold">5. DEPOZİTO VE İPTAL POLİTİKASI</span>
            </h2>

            <p className="mb-4">
              €500 depozitiniz randevunuzu güvence altına alır ve iade edilmez. Ancak, bu koşullar
              altında gelecekteki bir tarih için geçerli olacaktır:
            </p>

            <div className="flex flex-col gap-y-3">
              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Yeniden
                  Zamanlama:
                </h3>
                <p>
                  Orijinal randevunuzdan en az <span className="font-bold">14 gün</span> önce
                  WhatsApp aracılığıyla yazılı bildirim.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Tıbbi Acil
                  Durum:
                </h3>
                <p>Doğrulanabilir bir tıbbi sertifikanın sağlanması.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">
                  <span className="inline-flex -translate-y-[1.5px] scale-110">■</span> Uçuş İptali:
                </h3>
                <p>Resmi havayolu belgesi sunumu</p>
              </div>

              <p className="mt-2 text-black">
                14 günlük pencere içinde gerekli bildirim veya belgelerin sağlanmaması,
                depozitinizin kaybedilmesine neden olacaktır.
              </p>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={3} className="text-[10.5px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <h2 className="mb-3 font-custom-commuters text-[14px] text-primary uppercase">
              <span className="font-bold">6. SON ADIMLAR VE İLETİŞİM</span>
              <span className="block">BİLGİLERİ</span>
            </h2>

            <div className="flex flex-col gap-y-2">
              <p>
                Seyahatinizden önce herhangi bir sorunuz olması durumunda, size yardımcı olmak için
                buradayız.
              </p>
              <p>
                Size olağanüstü bir deneyim ve harika sonuçlar sağlamaya kararlıyız. İstanbul'a hoş
                geldiniz diyerek sabırsızlıkla sizleri bekliyoruz.
              </p>
              <p className="mt-2 font-semibold text-black">Saygı ve sevgilerimizle,</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-x-4">
              <img src="/logo-x.svg" alt="Hair Of Istanbul" className="h-24 w-28" />

              <div className="border-l border-stone-200 py-4 pl-4 text-[16px] font-bold text-black">
                <EditableText field={f('d2-p3-k8')} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-8 border-t border-stone-200 pt-6">
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">İletişim</h4>

                <EditableLink
                  editKey={f('d2-p3-k9').editKey}
                  defaultValue={f('d2-p3-k9').defaultValue}
                  seedValue={f('d2-p3-k9').seedValue}
                />

                <a href="https://www.hairofistanbul.com" className="underline">
                  www.hairofistanbul.com
                </a>

                <a href="mailto:info@hairofistanbul.com" className="underline">
                  info@hairofistanbul.com
                </a>
              </div>

              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">Adres</h4>
                <p className="whitespace-pre-line underline">
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
