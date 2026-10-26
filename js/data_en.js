// English names. Countries by their ISO letters: name | capital ("-" where none is asked).
const RAW = `
cn|China|Beijing
jp|Japan|Tokyo
kr|South Korea|Seoul
kp|North Korea|Pyongyang
tw|Taiwan|Taipei
mn|Mongolia|Ulaanbaatar
vn|Vietnam|Hanoi
th|Thailand|Bangkok
kh|Cambodia|Phnom Penh
la|Laos|Vientiane
mm|Myanmar|Naypyidaw
my|Malaysia|Kuala Lumpur
sg|Singapore|Singapore
id|Indonesia|Jakarta
ph|Philippines|Manila
bn|Brunei|Bandar Seri Begawan
tl|Timor-Leste|Dili
in|India|New Delhi
pk|Pakistan|Islamabad
bd|Bangladesh|Dhaka
lk|Sri Lanka|-
np|Nepal|Kathmandu
bt|Bhutan|Thimphu
mv|Maldives|Malé
af|Afghanistan|Kabul
ir|Iran|Tehran
iq|Iraq|Baghdad
sy|Syria|Damascus
lb|Lebanon|Beirut
il|Israel|-
ps|Palestine|-
jo|Jordan|Amman
sa|Saudi Arabia|Riyadh
ye|Yemen|Sanaa
om|Oman|Muscat
ae|United Arab Emirates|Abu Dhabi
qa|Qatar|Doha
kw|Kuwait|Kuwait City
bh|Bahrain|Manama
tr|Turkey|Ankara
cy|Cyprus|Nicosia
ge|Georgia|Tbilisi
am|Armenia|Yerevan
az|Azerbaijan|Baku
kz|Kazakhstan|Astana
uz|Uzbekistan|Tashkent
tm|Turkmenistan|Ashgabat
tj|Tajikistan|Dushanbe
kg|Kyrgyzstan|Bishkek
gb|United Kingdom|London
fr|France|Paris
de|Germany|Berlin
it|Italy|Rome
es|Spain|Madrid
pt|Portugal|Lisbon
nl|Netherlands|Amsterdam
be|Belgium|Brussels
lu|Luxembourg|Luxembourg
ch|Switzerland|Bern
at|Austria|Vienna
ie|Ireland|Dublin
is|Iceland|Reykjavík
no|Norway|Oslo
se|Sweden|Stockholm
dk|Denmark|Copenhagen
fi|Finland|Helsinki
ee|Estonia|Tallinn
lv|Latvia|Riga
lt|Lithuania|Vilnius
pl|Poland|Warsaw
cz|Czechia|Prague
sk|Slovakia|Bratislava
hu|Hungary|Budapest
ro|Romania|Bucharest
bg|Bulgaria|Sofia
gr|Greece|Athens
al|Albania|Tirana
mk|North Macedonia|Skopje
rs|Serbia|Belgrade
me|Montenegro|Podgorica
ba|Bosnia and Herzegovina|Sarajevo
hr|Croatia|Zagreb
si|Slovenia|Ljubljana
ua|Ukraine|Kyiv
by|Belarus|Minsk
md|Moldova|Chișinău
ru|Russia|Moscow
mt|Malta|Valletta
ad|Andorra|Andorra la Vella
mc|Monaco|Monaco
sm|San Marino|San Marino
va|Vatican City|Vatican City
li|Liechtenstein|Vaduz
eg|Egypt|Cairo
ly|Libya|Tripoli
tn|Tunisia|Tunis
dz|Algeria|Algiers
ma|Morocco|Rabat
sd|Sudan|Khartoum
ss|South Sudan|Juba
et|Ethiopia|Addis Ababa
er|Eritrea|Asmara
dj|Djibouti|Djibouti
so|Somalia|Mogadishu
ke|Kenya|Nairobi
tz|Tanzania|Dodoma
ug|Uganda|Kampala
rw|Rwanda|Kigali
bi|Burundi|Gitega
cd|DR Congo|Kinshasa
cg|Republic of the Congo|Brazzaville
ga|Gabon|Libreville
gq|Equatorial Guinea|Malabo
cm|Cameroon|Yaoundé
cf|Central African Republic|Bangui
td|Chad|N'Djamena
ng|Nigeria|Abuja
ne|Niger|Niamey
ml|Mali|Bamako
bf|Burkina Faso|Ouagadougou
gh|Ghana|Accra
ci|Côte d'Ivoire|Yamoussoukro
lr|Liberia|Monrovia
sl|Sierra Leone|Freetown
gn|Guinea|Conakry
gw|Guinea-Bissau|Bissau
sn|Senegal|Dakar
gm|Gambia|Banjul
mr|Mauritania|Nouakchott
bj|Benin|Porto-Novo
tg|Togo|Lomé
ao|Angola|Luanda
zm|Zambia|Lusaka
zw|Zimbabwe|Harare
mw|Malawi|Lilongwe
mz|Mozambique|Maputo
bw|Botswana|Gaborone
na|Namibia|Windhoek
za|South Africa|-
ls|Lesotho|Maseru
sz|Eswatini|-
mg|Madagascar|Antananarivo
mu|Mauritius|Port Louis
sc|Seychelles|Victoria
cv|Cape Verde|Praia
st|São Tomé and Príncipe|São Tomé
km|Comoros|Moroni
us|United States|Washington, D.C.
ca|Canada|Ottawa
mx|Mexico|Mexico City
gt|Guatemala|Guatemala City
bz|Belize|Belmopan
hn|Honduras|Tegucigalpa
sv|El Salvador|San Salvador
ni|Nicaragua|Managua
cr|Costa Rica|San José
pa|Panama|Panama City
cu|Cuba|Havana
jm|Jamaica|Kingston
ht|Haiti|Port-au-Prince
do|Dominican Republic|Santo Domingo
bs|Bahamas|Nassau
tt|Trinidad and Tobago|Port of Spain
bb|Barbados|Bridgetown
kn|Saint Kitts and Nevis|Basseterre
lc|Saint Lucia|Castries
vc|Saint Vincent and the Grenadines|Kingstown
gd|Grenada|St. George's
dm|Dominica|Roseau
ag|Antigua and Barbuda|St. John's
br|Brazil|Brasília
ar|Argentina|Buenos Aires
cl|Chile|Santiago
pe|Peru|Lima
co|Colombia|Bogotá
ve|Venezuela|Caracas
ec|Ecuador|Quito
bo|Bolivia|-
py|Paraguay|Asunción
uy|Uruguay|Montevideo
gy|Guyana|Georgetown
sr|Suriname|Paramaribo
au|Australia|Canberra
nz|New Zealand|Wellington
pg|Papua New Guinea|Port Moresby
fj|Fiji|Suva
sb|Solomon Islands|Honiara
vu|Vanuatu|Port Vila
ws|Samoa|Apia
to|Tonga|Nukuʻalofa
ki|Kiribati|-
mh|Marshall Islands|Majuro
fm|Micronesia|Palikir
pw|Palau|-
nr|Nauru|-
tv|Tuvalu|Funafuti
`;
export const EN = new Map(RAW.trim().split('\n').map((l) => { const [a2, name, cap] = l.split('|'); return [a2, { name, cap: cap === '-' ? null : cap }]; }));
export const CONT_EN = { 亞: 'Asia', 歐: 'Europe', 非: 'Africa', 北: 'North America', 南: 'South America', 洋: 'Oceania' };

// Taiwan's counties: the English name, and what each is known for (the same things, in the same order, as in data.js)
export const TW_EN = {
  台北市: ['Taipei City', ['Taipei 101', 'the National Palace Museum']], 新北市: ['New Taipei City', ['Jiufen', 'Tamsui', 'Yehliu']],
  基隆市: ['Keelung City', ['Miaokou Night Market', 'Heping Island']], 桃園市: ['Taoyuan City', ['Taoyuan International Airport', 'Daxi Old Street']],
  新竹市: ['Hsinchu City', ['the City God Temple', 'rice noodles and meatballs']], 新竹縣: ['Hsinchu County', ['Neiwan Old Street']],
  苗栗縣: ['Miaoli County', ['Sanyi wood carving']], 台中市: ['Taichung City', ['Fengjia Night Market', 'Gaomei Wetlands']],
  彰化縣: ['Changhua County', ['the Great Buddha of Baguashan', 'Lukang Old Street']], 南投縣: ['Nantou County', ['Sun Moon Lake', 'Cingjing Farm']],
  雲林縣: ['Yunlin County', ['Beigang Chaotian Temple', 'Gukeng coffee']], 嘉義市: ['Chiayi City', ['turkey rice']],
  嘉義縣: ['Chiayi County', ['Alishan']], 台南市: ['Tainan City', ['Chihkan Tower', 'Anping Fort']],
  高雄市: ['Kaohsiung City', ['the Pier-2 Art Center', 'Lotus Pond']], 屏東縣: ['Pingtung County', ['Kenting', 'Eluanbi Lighthouse']],
  宜蘭縣: ['Yilan County', ['Guishan Island', 'Jiaoxi hot springs']], 花蓮縣: ['Hualien County', ['Taroko Gorge', 'Qingshui Cliff']],
  台東縣: ['Taitung County', ['Green Island', 'Orchid Island', 'Luye hot-air balloons']], 澎湖縣: ['Penghu County', ['the Twin Hearts Stone Weir']],
  金門縣: ['Kinmen County', ['peanut candy', 'kaoliang liquor']], 連江縣: ['Lienchiang County (Matsu)', ['the Matsu Islands', 'the Blue Tears']],
};

// the general questions in English, in the same order as FACTS in data.js
export const FACTS_EN = [
  ['Which is the highest mountain in the world?', 'Mount Everest', 'Yushan', 'Mount Fuji', 'Kilimanjaro'],
  ['Which is the largest ocean?', 'Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
  ['Which is the largest continent?', 'Asia', 'Africa', 'North America', 'Europe'],
  ['Which is the largest country by area?', 'Russia', 'Canada', 'China', 'United States'],
  ['Which country is most famous for its pyramids?', 'Egypt', 'Mexico', 'Peru', 'Greece'],
  ['In which city is the Eiffel Tower?', 'Paris', 'London', 'Rome', 'Berlin'],
  ['In which country is the Statue of Liberty?', 'United States', 'France', 'United Kingdom', 'Canada'],
  ['In which country is the Sydney Opera House?', 'Australia', 'New Zealand', 'United Kingdom', 'United States'],
  ['In which country is Mount Fuji?', 'Japan', 'South Korea', 'China', 'Vietnam'],
  ['In which country is the Great Wall?', 'China', 'Mongolia', 'Japan', 'India'],
  ['Which country is shaped like a boot?', 'Italy', 'Greece', 'Spain', 'Chile'],
  ['Which is the highest mountain in Taiwan?', 'Yushan', 'Xueshan', 'Hehuanshan', 'Alishan'],
  ['Which county is Sun Moon Lake in?', 'Nantou County', 'Chiayi County', 'Taichung City', 'Hualien County'],
  ['Which county is Alishan in?', 'Chiayi County', 'Nantou County', 'Taitung County', 'Pingtung County'],
  ['Which county is Kenting National Park in?', 'Pingtung County', 'Taitung County', 'Kaohsiung City', 'Tainan City'],
  ['Which county is most of Taroko National Park in?', 'Hualien County', 'Yilan County', 'Taitung County', 'Nantou County'],
  ['Which strait lies between Taiwan and mainland China?', 'Taiwan Strait', 'Bashi Channel', 'Strait of Malacca', 'Bering Strait'],
  ['Which continent has the most penguins?', 'Antarctica', 'North America', 'Europe', 'Asia'],
  ['Which country has the most people?', 'India', 'China', 'United States', 'Indonesia'],
  ['Which is the smallest country in the world?', 'Vatican City', 'Monaco', 'Singapore', 'Luxembourg'],
  ['Which river is usually called the longest in the world?', 'Nile', 'Yangtze', 'Mississippi', 'Danube'],
  ['Which river carries the most water?', 'Amazon', 'Nile', 'Yangtze', 'Ganges'],
  ['Which is the largest hot desert in the world?', 'Sahara', 'Gobi', 'Atacama', 'Kalahari'],
  ['Which is the largest island in the world?', 'Greenland', 'Australia', 'Borneo', 'Madagascar'],
  ['Which is the longest river in Taiwan?', 'Zhuoshui River', 'Tamsui River', 'Gaoping River', 'Dajia River'],
  ['Which is the largest county in Taiwan by area?', 'Hualien County', 'Nantou County', 'Taitung County', 'Kaohsiung City'],
  ['Which city in Taiwan has the most people?', 'New Taipei City', 'Taipei City', 'Taichung City', 'Kaohsiung City'],
  ['Which is the only county in Taiwan without a coast?', 'Nantou County', 'Chiayi City', 'Hsinchu County', 'Miaoli County'],
  ['Fuguijiao, the northern tip of Taiwan, is in which city?', 'New Taipei City', 'Keelung City', 'Taipei City', 'Yilan County'],
  ['The southern tip of Taiwan is in which county?', 'Pingtung County', 'Taitung County', 'Kaohsiung City', 'Tainan City'],
  ['Guishan Island lies off the coast of which county?', 'Yilan County', 'Hualien County', 'Keelung City', 'New Taipei City'],
  ['Green Island and Orchid Island belong to which county?', 'Taitung County', 'Pingtung County', 'Hualien County', 'Penghu County'],
  ['In which country is Angkor Wat?', 'Cambodia', 'Thailand', 'Vietnam', 'Myanmar'],
  ['In which country is the Taj Mahal?', 'India', 'Pakistan', 'Iran', 'Turkey'],
  ['In which country is Machu Picchu?', 'Peru', 'Mexico', 'Chile', 'Bolivia'],
  ['In which country is the Leaning Tower of Pisa?', 'Italy', 'Spain', 'France', 'Greece'],
  ['In which country is Rio de Janeiro’s Christ the Redeemer?', 'Brazil', 'Argentina', 'Portugal', 'Mexico'],
  ['In which country is Stonehenge?', 'United Kingdom', 'Ireland', 'France', 'Norway'],
  ['In which city is the Sagrada Família?', 'Barcelona', 'Madrid', 'Rome', 'Lisbon'],
  ['In which city is the Golden Gate Bridge?', 'San Francisco', 'New York', 'Los Angeles', 'Seattle'],
  ['Which is the highest mountain in Africa?', 'Kilimanjaro', 'Mount Kenya', 'Atlas Mountains', 'Mount Everest'],
  ['Which is the longest mountain range in South America?', 'Andes', 'Rocky Mountains', 'Alps', 'Himalayas'],
  ['On which continent are the Alps?', 'Europe', 'Asia', 'North America', 'South America'],
  ['Most of the Amazon rainforest is in which country?', 'Brazil', 'Peru', 'Colombia', 'Venezuela'],
  ['Which canal joins the Pacific and the Atlantic?', 'Panama Canal', 'Suez Canal', 'Kiel Canal', 'Grand Canal'],
  ['The Suez Canal joins the Red Sea and which sea?', 'Mediterranean Sea', 'Black Sea', 'Arabian Sea', 'Caspian Sea'],
  ['Which strait separates Europe and Africa?', 'Strait of Gibraltar', 'English Channel', 'Bering Strait', 'Strait of Malacca'],
  ['Which strait separates Asia and North America?', 'Bering Strait', 'Strait of Gibraltar', 'Taiwan Strait', 'Drake Passage'],
  ['The English Channel separates the United Kingdom and which country?', 'France', 'Netherlands', 'Belgium', 'Ireland'],
  ['Which is the largest lake in the world by area?', 'Caspian Sea', 'Lake Superior', 'Lake Baikal', 'Lake Victoria'],
  ['Which is the deepest lake in the world?', 'Lake Baikal', 'Caspian Sea', 'Lake Tanganyika', 'Lake Superior'],
  ['Which is the deepest ocean trench?', 'Mariana Trench', 'Puerto Rico Trench', 'Japan Trench', 'Java Trench'],
  ['Which is the highest waterfall in the world?', 'Angel Falls', 'Niagara Falls', 'Victoria Falls', 'Iguazu Falls'],
  ['In which country is Angel Falls?', 'Venezuela', 'Brazil', 'Argentina', 'Colombia'],
  ['Which South American country is named after the equator?', 'Ecuador', 'Colombia', 'Peru', 'Brazil'],
  ['The prime meridian (0° longitude) passes through which city?', 'London', 'Paris', 'Rome', 'Cairo'],
  ['Which is the longest river in Europe?', 'Volga', 'Danube', 'Rhine', 'Seine'],
  ['Which is the highest mountain in North America?', 'Denali', 'Mount Whitney', 'Mount Logan', 'Mount Rainier'],
  ['Which country is the longest and narrowest?', 'Chile', 'Norway', 'Japan', 'Vietnam'],
  ['Taiwan’s Tropic of Cancer markers are in Chiayi County and which county?', 'Hualien County', 'Taitung County', 'Nantou County', 'Pingtung County'],
  ['Which is the largest natural lake in Taiwan?', 'Sun Moon Lake', 'Chengcing Lake', 'Liyu Lake', 'Cuifeng Lake'],
  ['The Strait of Malacca lies between the Malay Peninsula and which island?', 'Sumatra', 'Borneo', 'Java', 'New Guinea'],
  ['The Ganges flows mainly through which country?', 'India', 'Thailand', 'Pakistan', 'Myanmar'],
  ['The Mekong reaches the sea in which country?', 'Vietnam', 'Thailand', 'Cambodia', 'Laos'],
  ['On which continent is the Sahara?', 'Africa', 'Asia', 'Oceania', 'South America'],
  ['The Gobi Desert lies mainly in which two countries?', 'China and Mongolia', 'India and Pakistan', 'Iran and Iraq', 'Kazakhstan and Russia'],
  ['Which time zone is Taiwan in?', 'UTC+8', 'UTC+9', 'UTC+7', 'UTC+10'],
  ['Which is the largest country in South America?', 'Brazil', 'Argentina', 'Peru', 'Colombia'],
  ['Which is the largest country in Africa?', 'Algeria', 'DR Congo', 'Sudan', 'Egypt'],
  ['Which is the longest river in Asia?', 'Yangtze', 'Yellow River', 'Mekong', 'Ganges'],
  ['One of the driest deserts in the world, in Chile, is the…', 'Atacama', 'Sahara', 'Namib', 'Gobi'],
  ['Which country lies in both Europe and Asia and has Ankara as its capital?', 'Turkey', 'Russia', 'Kazakhstan', 'Azerbaijan'],
  ['Niagara Falls is on the border of which two countries?', 'United States and Canada', 'United States and Mexico', 'Brazil and Argentina', 'Zambia and Zimbabwe'],
  ['Iguazu Falls is on the border of which two countries?', 'Brazil and Argentina', 'Peru and Chile', 'United States and Canada', 'Venezuela and Colombia'],
  ['Victoria Falls is on the border of which two countries?', 'Zambia and Zimbabwe', 'Kenya and Tanzania', 'South Africa and Botswana', 'Egypt and Sudan'],
  ['Which is the largest island country by area?', 'Indonesia', 'Japan', 'Philippines', 'United Kingdom'],
  ['One of the highest capitals in the world, in Bolivia, is…', 'La Paz', 'Quito', 'Bogotá', 'Lima'],
  ['In which country is Uluru (Ayers Rock)?', 'Australia', 'New Zealand', 'United States', 'South Africa'],
  ['Which country do the Galápagos Islands belong to?', 'Ecuador', 'Chile', 'Peru', 'Colombia'],
  ['Which country do Easter Island’s moai belong to?', 'Chile', 'Peru', 'New Zealand', 'Mexico'],
];
