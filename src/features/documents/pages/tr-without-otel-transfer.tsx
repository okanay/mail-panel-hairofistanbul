import { useAuth } from '@/providers/auth'
import { EditablePage } from '../components/editable-page'
import { EditableText } from '../components/editable-text'
import { EditorMenu } from '../components/menu-editor'
import { EditableLink } from '../components/editable-link'
import { HideableText } from '../components/hideable-text'

export const WithoutOtelTransferPageTR = () => {
  const { user } = useAuth()

  // Form Data Definition for WithoutOtelTransferPageTR
  const formData: DocumentFormData = [
    {
      name: 'Müşteri Adı',
      editKey: 'd3-p1-k1',
      defaultValue: 'MÜŞTERİ-ADI',
      inputMode: 'text',
    },
    {
      name: 'Operasyon Tarihi',
      editKey: 'd3-p1-k2',
      defaultValue: 'Salı, 28 Temmuz 1998',
      inputMode: 'text',
    },
    {
      name: 'Varış Günü (1. Gün)',
      editKey: 'd3-p1-k3',
      defaultValue: '(Perşembe, 26 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: 'Prosedür Günü (2. Gün)',
      editKey: 'd3-p1-k4',
      defaultValue: '(Cuma, 27 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: 'Kontrol Günü (3. Gün)',
      editKey: 'd3-p2-k1',
      defaultValue: '(Cumartesi, 28 Mart 2026)',
      inputMode: 'text',
    },
    {
      name: 'Toplam Paket Değeri',
      editKey: 'd3-p3-k2-e1',
      defaultValue: '$4,300',
      inputMode: 'text',
    },
    {
      name: 'Toplam Paket Değerini Gizle',
      editKey: 'd3-p3-k1-h1',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Depozito Miktarı',
      editKey: 'd3-p3-k4-e2',
      defaultValue: '€500 (Non-refundable)',
      inputMode: 'text',
    },
    {
      name: 'Alınan Depozitoyu Gizle',
      editKey: 'd3-p3-k3-h2',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Kalan Bakiye',
      editKey: 'd3-p3-k6-e3',
      defaultValue: '€3,800',
      inputMode: 'text',
    },
    {
      name: 'Kalan Bakiyeyi Gizle',
      editKey: 'd3-p3-k5-h3',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Bakiye Son Ödeme Tarihini Gizle',
      editKey: 'd3-p3-k7-h4',
      defaultValue: false,
      inputMode: 'toggle',
    },
    {
      name: 'Temsilci Adı',
      editKey: 'd3-p3-k8',
      defaultValue: 'AD-SOYAD',
      seedValue: user?.name,
      inputMode: 'text',
    },
    {
      name: 'İletişim Telefonu',
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
            Sayın <EditableText editKey="d3-p1-k1">{'MÜŞTERİ-ADI'}</EditableText>,
          </h1>

          <p>
            Bu mesajın sizi iyi bulduğunu umuyoruz. Hair of İstanbul ailesinin tamamı adına, sizin
            saç nakli işleminizin{' '}
            <EditableText editKey="d3-p1-k2" className="font-bold">
              {'Salı, 28 Temmuz 1998'}
            </EditableText>{' '}
            tarihine planlandığını resmi olarak onaylamaktan mutluluk duyuyoruz. Bu e-posta,
            randevunuzun kapsamlı onaylaması ve rehber niteliğindedir. Sorunsuz ve başarılı bir
            deneyim sağlamak için, lütfen aşağıdaki bilgileri dikkatle incelemenizi rica ediyoruz.
          </p>
        </header>

        <article className="mt-6 flex flex-col gap-y-6">
          <section>
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">1. KRİTİK TIBBİ BİLGİ</span>
              <span className="block">VE AÇIKLAMALAR</span>
            </h2>

            <p className="my-2">
              Güvenliğiniz bizim için en yüksek önceliktir. Lütfen aşağıdaki zorunlu koşulları
              dikkate alınız:
            </p>

            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">■ Operasyon Öncesi Tarama</h3>
                <p>
                  İşlem günü kliniğimizde zorunlu HIV ve Hepatit B/C kan testleri yapılacaktır. Her
                  iki hastalıktan birinin pozitif sonucu çıkması, maalesef işlemin yapılmasını
                  engelleyecektir.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ İşlem Kontrendikasyonları:</h3>
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
                <h3 className="font-bold text-primary">■ Gerekli Tıbbi Açıklama:</h3>
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
                <h3 className="font-bold text-primary">■ Olası Erteleme:</h3>
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
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">2. RANDEVUNUZ</span>
              <span className="block">PROGRAMME VE İTİNERARY</span>
            </h2>

            <div className="mt-2 flex flex-col gap-y-5">
              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Gün 1: Varış ve Karşılama </span>
                  <EditableText editKey="d3-p1-k3">{'(Perşembe, 26 Mart 2026)'}</EditableText>
                </h2>

                <p className="mb-2">
                  Randevunuzdan bir gün önce kesin varış saatinizi içeren bir mesaj alacaksınız.
                  Lütfen belirtilen saatte kliniğimize gelmek için gelebilirsiniz. Gün aşağıdaki
                  şekilde ilerleyecektir:
                </p>

                <div className="mb-3 space-y-1">
                  <div>
                    <span className="font-bold">1. Operasyon öncesi kontroller: </span>
                    <span>EKG ve kapsamlı kan testi.</span>
                  </div>
                  <div>
                    <span className="font-bold">2. Danışmanlık: </span>
                    <span>Doktorumuzla derinlemesine bir görüşme.</span>
                  </div>
                  <div>
                    <span className="font-bold">3. Tasarım Oturumu: </span>
                    <span>
                      Estetik ekibimiz tarafından özel saç çizgisi tasarımı. İşlem, yeterli tıbbi
                      izin ve saç çizgisi tasarımınız için son onayınız alındıktan sonra
                      başlayacaktır. İşlem, Foliküler Ünite Ekstraksiyon (FUE) tekniği kullanılarak
                      lokal anestezi altında yapılacak ve genellikle 6–8 saat sürecektir.
                      Paketinizin bir parçası olarak gerekli operasyon sonrası tüm ilaçları ve{' '}
                      <span className="font-bold">bir PRP seansı</span> alacaksınız.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[14px]">
                  <span className="font-bold">Gün 2: Operasyon Günü </span>
                  <EditableText editKey="d3-p1-k4">{'(Cuma, 27 Mart 2026)'}</EditableText>
                </h2>
                <p>
                  Lütfen donor bölgesindeki bandajın çıkarılması ve tıbbi ekibimiz tarafından
                  ilerlemenin değerlendirilmesi için kliniğe dönünüz. Randevu saatini operasyon günü
                  sırasında belirleyeceğiz.
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
              <span className="font-bold">Gün 3: Operasyon Sonrası Kontrol </span>
              <EditableText editKey="d3-p2-k1">{'(Cumartesi, 28 Mart 2026)'}</EditableText>
            </h2>
            <p>
              Son ziyaretinizde ilk profesyonel saç yıkama ve ev bakım rutininiz hakkında ayrıntılı
              bir eğitim alacaksınız. Bu, iyileşme sürecinizi tam olarak yönetebilmeniz için sizi
              hazırlaması sağlayacaktır. Kontrol saatini kontrol sırasında belirleyeceğiz.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] text-primary">
              <span className="font-bold">3. OPERASYON ÖNCESİ</span>
              <span className="block">HAZIRLIK TÜRLERİ</span>
            </h2>

            <p className="mt-2">
              İşleminiz için optimal koşullar sağlamak amacıyla lütfen bu talimatlar doğrultusunda
              hareket ediniz:
            </p>

            <div className="mt-3 flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-primary">■ Madde Kullanımı Abstinansı:</h3>
                <p>
                  İşlemden <span className="font-bold">bir hafta</span> önce alkol tüketiminden
                  kaçının, çünkü kanı seyreltebilir.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ İlaç Yönetimi:</h3>
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
                <h3 className="font-bold text-primary">■ Saç Hazırlığı:</h3>
                <p>
                  Randevunuzdan bir ay öncesine kadar saçınızı (arka ve yanları da dahil) kesmeyin,
                  kesmez veya traş etmeyin. <span className="font-bold">bir ay</span>
                  Doğru bir değerlendirmeye ve en iyi saç çizgisi tasarımına olanak tanır.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Tıbbi Açıklama:</h3>
                <p>
                  Lütfen tüm düzenli ilaçlarınızı (adı ve dozu) ve bilinen tıbbi koşullarınızı bize
                  bilgilendiriniz.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Seyahat Lojistiği:</h3>
                <p>
                  Dönüş uçuşunuzu <span className="font-bold">kontrol bagajı ile</span> rezerve
                  ediniz. Sağlanan bakım şampuanı ve tıbbi köpük 100ml'i aşarken kabin bagajında
                  taşınamaz.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Kıyafet:</h3>
                <p>
                  İşlem günü ve takip eden günlerde geniş, rahat kıyafet giyin. Geniş yaka veya ön
                  fermuarlı (örneğin, cepli gömlek) ve işlenen alanla temas etmeyin.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Rahatlık Eşyası:</h3>
                <p>
                  İlk iyileşme gecelerinde başın düzgün şekilde yükseltilmesini desteklemek için{' '}
                  <span className="font-bold">U şeklinde bir seyahat yastığı</span> getirmenizi
                  şiddetle tavsiye ederiz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[14px] leading-tight text-primary uppercase">
              <span className="font-bold">4. PAKET ÖZETİ VE</span>
              <span className="block">FİNANSAL ANLAŞMA</span>
            </h2>

            <div className="mt-4">
              <h3 className="mb-2 text-[11px] font-bold text-black">
                Hepsi Dahil Paketiniz Kapsar:
              </h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>FUE tekniği kullanılarak Saç Nakli işlemi.</li>
                <li>Tüm özel transferler (Havalimanı ⇄ Otel ⇄ Klinik).</li>
                <li>Adanmış tercüman hizmetleri.</li>
                <li>Crowne Plaza İstanbul Florya'da 3 gece (5 yıldızlı).</li>
                <li>Tüm operasyon sonrası ilaçlar.</li>
                <li>Bir (1) PRP seansı.</li>
                <li>Bakım kiti (Şampuan ve Köpük Spreyi).</li>
              </ul>
            </div>
          </section>
        </article>
      </EditablePage>

      <EditablePage index={2} className="text-[10px] leading-relaxed">
        <article className="flex flex-col gap-y-6">
          <section>
            <div>
              <h3 className="mb-2 text-[12px] font-bold text-black">Finansal Şartlar:</h3>
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
              <h3 className="mb-1 font-bold text-primary">■ Ödeme Detayları:</h3>
              <ul className="flex flex-col gap-y-2">
                <li>
                  <span className="font-bold">• Kabul Edilen Yöntemler: </span>
                  Nakit (EUR/USD/GBP), Başlıca Kripto Paralar, Banka/Kredi Kartı veya Banka
                  Transferi.
                </li>
                <li>
                  <span className="font-bold">• Önemli Not: </span>
                  Kart aracılığıyla yapılan ödemeler zorunlu{' '}
                  <span className="font-bold">%10 KDV</span> uygulamasına tabidir.
                </li>
                <li>
                  <span className="font-bold">• Kabul Edilen Para Birimleri: </span>
                  EUR, USD, GBP, CAD, AUD, CHF, TRY. *Kabul edemiyoruz: İskoç/İrlanda Sterlini, eski
                  dizi ABD banknotları veya €500 değerleri.*
                </li>
                <li>
                  <span className="font-bold">• Seyahat Öncesi: </span>
                  Lütfen ödeme kartınızın uluslararası işlemler için etkinleştirildiğinden ve
                  bakiyeyi karşılamak için yeterli limitinin olduğundan emin olunuz.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[14px] text-primary uppercase">
              <span className="font-bold">5. DEPOZİTO VE İPTAL POLİTİKASI</span>
            </h2>

            <p className="mb-4">
              €500 depozitiniz randevunuzu güvence altına alır ve iade edilmez. Ancak, bu koşullar
              altında gelecekteki bir tarih için geçerli olacaktır:
            </p>

            <div className="flex flex-col gap-y-3">
              <div>
                <h3 className="font-bold text-primary">■ Yeniden Zamanlama:</h3>
                <p>
                  Orijinal randevunuzdan en az <span className="font-bold">14 gün</span> önce
                  WhatsApp aracılığıyla yazılı bildirim.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Tıbbi Acil Durum:</h3>
                <p>Doğrulanabilir bir tıbbi sertifikanın sağlanması.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary">■ Uçuş İptali:</h3>
                <p>Resmi havayolu belgesi sunumu</p>
              </div>

              <p className="mt-2 text-black">
                14 günlük pencere içinde gerekli bildirim veya belgelerin sağlanmaması,
                depozitinizin kaybedilmesine neden olacaktır.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[14px] text-primary uppercase">
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

              <div className="border-l border-gray-200 py-4 pl-4 text-[16px] font-bold text-black">
                <EditableText seedText={user?.name} editKey="d3-p3-k8">
                  {'AD-SOYAD'}
                </EditableText>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col gap-y-1">
                <h4 className="mb-1 font-bold text-black">İletişim</h4>
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
    </div>
  )
}
