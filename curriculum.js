'use strict';
// Original practice questions mapped to selected MOE primary syllabus topics.
const MOE_SOURCES={
Math:{title:'MOE 2021 Primary Mathematics (updated October 2025)',url:'https://cms.moe.gov.sg/assets/92bff26d-b2b4-4535-b868-b8415c744b91/2021%20Primary%20Mathematics%20Syllabus%20P1%20to%20P6%20Updated%20October%202025.pdf'},
Science:{title:'MOE 2023 Primary Science',url:'https://www.moe.gov.sg/media/files/primary/syllabus/ba3562d3-5b31-4459-8693-45cde7b97273.pdf'},
English:{title:'MOE 2020 Primary English Language',url:'https://www.moe.gov.sg/media/files/primary/b8eb0437-67fb-4042-a26c-64fef2af12df.pdf'}
};
const MOE_BANK=[];
function addMoe(subject,grade,topic,q,a,wrong,explanation){
  const answer=String(a), choices=[...new Set([answer,...wrong.map(String)])];
  if(choices.length!==4)throw new Error('Question needs four distinct answers: '+q);
  MOE_BANK.push({id:`moe-${subject}-${grade}-${MOE_BANK.length}`,subject,grade,topic,q,a:answer,choices,explanation,source:MOE_SOURCES[subject]});
}
function math(grade,topic,q,a,explanation){
  const wrong=[];for(const delta of [1,-1,10,-10,2,-2]){const value=Number((a+delta).toFixed(2));if(value>=0&&value!==a&&!wrong.includes(value))wrong.push(value);if(wrong.length===3)break}
  addMoe('Math',grade,topic,q,a,wrong,explanation);
}
for(let n=1;n<=20;n++){
  math(1,'Whole numbers',`What is ${n+12} + ${n+5}?`,2*n+17,'Add the two quantities to find the total.');
  math(1,'Whole numbers',`Mei has ${n+25} stickers and gives away ${n+4}. How many remain?`,21,'Subtract the number given away from the starting number.');
  math(1,'Money',`A pencil costs ${n+10} cents and an eraser costs 20 cents. What is the total in cents?`,n+30,'Add the two prices; both are in cents.');
  math(1,'Length',`A ribbon is ${n+20} cm long. A ${n} cm piece is cut off. How many centimetres remain?`,20,'Remaining length = starting length minus the cut piece.');
  math(1,'Number patterns',`What comes next: ${n}, ${n+2}, ${n+4}, ___?`,n+6,'The sequence increases by 2 each time.');
  math(2,'Place value',`What is the value of digit 4 in ${400+10*n%100+3}?`,400,'The digit 4 is in the hundreds place.');
  math(2,'Multiplication',`There are ${n%9+2} bags with 5 marbles in each. How many marbles altogether?`,5*(n%9+2),'Multiply the number of bags by 5.');
  math(2,'Fractions',`A cake has 8 equal pieces. ${n%6+1} are eaten. How many eighths remain?`,8-(n%6+1),'Subtract the eaten pieces from 8; the pieces have equal size.');
  math(2,'Time',`How many minutes are there in 1 hour and ${n+10} minutes?`,n+70,'One hour is 60 minutes. Add the remaining minutes.');
  math(2,'Picture graphs',`A picture graph uses one star for 5 pupils. There are ${n%8+2} stars. How many pupils are shown?`,5*(n%8+2),'Multiply the number of stars by the scale of 5.');
  math(3,'Whole numbers',`A library has ${1200+n*10} books. It receives 135 more. How many books does it have now?`,1335+n*10,'Add the new books to the existing books.');
  math(3,'Area',`A rectangle is ${n+4} cm long and 3 cm wide. What is its area in cm²?`,3*(n+4),'Rectangle area = length × width.');
  math(3,'Perimeter',`A square has sides of ${n+3} cm. What is its perimeter in cm?`,4*(n+3),'A square has four equal sides.');
  math(3,'Measurement',`What is ${n+1} kg in grams?`,1000*(n+1),'1 kilogram equals 1000 grams.');
  math(3,'Bar graphs',`A bar graph shows ${n+8} pupils choosing football and ${n+3} choosing swimming. How many more choose football?`,5,'Compare the two bars by subtraction.');
  math(4,'Decimals',`What is ${(n/10+1).toFixed(1)} + 0.25?`,Number((n/10+1.25).toFixed(2)),'Align the decimal points before adding.');
  math(4,'Factors',`The number ${3*(n+3)} is exactly divisible by 3. What is the quotient?`,n+3,'Division undoes multiplication.');
  math(4,'Angles',`Two angles together make a right angle. One is ${n+25}°. What is the other angle in degrees?`,65-n,'A right angle is 90°. Subtract the known angle.');
  math(4,'Fractions',`What is 1/4 of ${4*(n+3)}?`,n+3,'Divide the total into four equal parts.');
  math(4,'Perimeter',`A rectangle is ${n+5} cm long and 4 cm wide. What is its perimeter in cm?`,2*(n+9),'Add length and width, then multiply by 2.');
  math(5,'Percentage',`What is 20% of ${5*(n+10)}?`,n+10,'20% is one fifth. Divide by 5.');
  math(6,'Ratio',`Red:blue beads = 2:3. There are ${2*(n+2)} red beads. How many blue beads are there?`,3*(n+2),'Find one ratio unit by dividing red beads by 2, then multiply by 3.');
  math(6,'Average',`Three test scores are ${n+60}, ${n+66} and ${n+72}. What is their average?`,n+66,'Add the three scores and divide by 3.');
  math(5,'Volume',`A cuboid is ${n+3} cm long, 4 cm wide and 2 cm high. What is its volume in cm³?`,8*(n+3),'Cuboid volume = length × width × height.');
  math(5,'Fractions',`What is 3/4 of ${4*(n+5)}?`,3*(n+5),'Divide by 4 to find one quarter, then multiply by 3.');
  math(6,'Algebra',`A book costs $b. What is 3b + 2 when b = ${n+3}?`,3*(n+3)+2,'Substitute the value of b and perform multiplication before addition.');
  math(6,'Percentage',`A bag costs $${5*(n+20)}. It is discounted by 20%. What is the sale price in dollars?`,4*(n+20),'The sale price is 80% of the original price.');
  math(6,'Ratio',`Ali:Mei savings = 3:5 and their total is $${8*(n+3)}. How many dollars does Mei have?`,5*(n+3),'There are 8 equal units altogether. Mei has 5 of them.');
  math(6,'Angles',`A triangle has angles ${n+30}° and 60°. What is its third angle in degrees?`,90-n,'Angles in a triangle add up to 180°.');
  math(6,'Volume',`A tank has a base area of ${n+10} cm² and water depth of 5 cm. What is the water volume in cm³?`,5*(n+10),'Water volume = base area × depth.');
}
const SCIENCE={
3:[
['Living things','Which observation best shows that a seed is living?','It can grow','It is small','It is brown','It is hard','Growth is a characteristic of living things when suitable conditions are present.'],
['Living things','Which is a non-living thing?','A rock','A mushroom','A grass plant','An ant','Rocks do not carry out life processes such as growth and reproduction.'],
['Classification','Which animal is an insect?','A butterfly','A spider','A snail','An earthworm','Insects have six legs. Spiders have eight.'],
['Classification','Which animal breathes through gills as an adult?','A fish','A cat','A butterfly','A bird','Fish take in dissolved oxygen using their gills.'],
['Materials','Which property makes glass useful for a window?','It lets light pass through','It is magnetic','It dissolves easily','It stretches easily','Transparent glass allows light to pass through.'],
['Materials','Which material is best for absorbing a small spill?','Cotton cloth','Plastic sheet','Glass tile','Metal spoon','Cotton absorbs water better than the non-absorbent alternatives.'],
['Materials','Why is plastic useful for a raincoat?','It is waterproof','It is absorbent','It is magnetic','It is transparent in every form','A waterproof material prevents rain from soaking through.'],
['Life cycles','Which stage comes after the caterpillar in a butterfly life cycle?','Pupa','Egg','Adult butterfly immediately','Seed','The sequence is egg, caterpillar, pupa, adult butterfly.'],
['Life cycles','Which animal has a tadpole stage?','Frog','Chicken','Cat','Butterfly','A tadpole is the young stage of a frog.'],
['Life cycles','Which is the correct first stage in a flowering plant life cycle?','Seed','Adult animal','Pupa','Chick','A new flowering plant can grow from a seed.'],
['Magnets','What happens when two north poles are brought close together?','They repel','They attract','They melt','They lose all mass','Like magnetic poles repel.'],
['Magnets','Which object is most likely attracted to a magnet?','An iron nail','A rubber band','A wooden ruler','A glass marble','Iron is a magnetic material.'],
['Magnets','Where is a bar magnet usually strongest?','At its poles','Only at its middle','Equally in the air everywhere','Only on its painted side','Magnetic effects are strongest near the poles.'],
['Magnets','A magnet attracts a nail through paper. What does this show?','Magnetic force can act through some materials','Paper becomes iron','The magnet needs direct contact','All materials are magnetic','Magnetic force can act without direct contact.'],
['Inquiry','To compare how well towels absorb water, what should stay the same?','The amount of water used','The towel material','The result of the test','The final wetness','A fair comparison changes the material while keeping the water amount the same.']
],
4:[
['Matter','Which state of matter has a fixed volume but takes the shape of its container?','Liquid','Solid','Gas','None','A liquid has a fixed volume but no fixed shape.'],
['Matter','Why can air be squeezed into a smaller space?','Air is compressible','Air has no mass','Air is a solid','Air has a fixed shape','Gases can be compressed into a smaller volume.'],
['Matter','Which observation shows that air occupies space?','An inflated balloon becomes larger','A stone falls','A lamp lights up','A magnet attracts a nail','Air takes up space inside the balloon.'],
['Heat','A metal spoon in hot soup becomes warm. Why?','Heat flows from the hot soup to the cooler spoon','Cold flows into the soup','The spoon makes heat from nothing','The soup turns into metal','Heat flows from a hotter object to a cooler one.'],
['Heat','Which tool is used to measure temperature?','Thermometer','Ruler','Measuring cylinder','Balance','A thermometer measures temperature.'],
['Heat','Why is a wooden handle useful on a cooking pan?','Wood is a poor conductor of heat','Wood is always cold','Wood absorbs all heat instantly','Wood is magnetic','A poor conductor transfers heat slowly to the hand.'],
['Light','What is needed for a shadow to form?','An opaque object blocking light','Only a transparent object','Only air','A magnet','A shadow forms where light is blocked.'],
['Light','Which object is a source of light?','A switched-on torch','The Moon','A mirror','A white shirt','A torch produces light; the others mainly reflect it.'],
['Light','How do we usually see a book in daylight?','Light reflected from the book enters our eyes','Our eyes send light into the book','The book creates all the light','A magnet carries the image','We see an object when light from it reaches our eyes.'],
['Plant parts','Which part usually takes in water from soil?','Roots','Flowers','Fruits','Petals','Roots absorb water and mineral salts.'],
['Plant parts','Which plant part mainly supports leaves and flowers?','Stem','Seed','Petal','Fruit','The stem supports the plant and transports substances.'],
['Digestive system','Where does digestion begin?','Mouth','Large intestine','Heart','Lungs','Food is broken down in the mouth with teeth and saliva.'],
['Digestive system','Which organ absorbs most digested food into the blood?','Small intestine','Lungs','Heart','Gullet','Digested food is absorbed through the small intestine.'],
['Digestive system','What is the main function of the digestive system?','Break down food for absorption','Pump blood','Move bones','Produce light','Digestion breaks food into substances the body can absorb.'],
['Inquiry','A pupil tests which material blocks light. What should be changed?','The material being tested','The torch brightness each time','The distance each time','The observation method each time','Change only the material to make the comparison fair.']
],
5:[
['Reproduction','What is pollination?','Transfer of pollen to the stigma','A seed taking in water','A leaf making food','A root growing longer','Pollination transfers pollen from an anther to a stigma.'],
['Reproduction','Why is seed dispersal useful?','It reduces competition with the parent plant','It makes all seeds identical','It prevents all germination','It turns seeds into pollen','Dispersal spreads seeds away from the parent plant.'],
['Reproduction','Which condition is usually needed for seed germination?','Water','Fertiliser in every case','Sunlight in every case','Flowers nearby','Seeds need water, oxygen and a suitable temperature; sunlight is not required for all seeds to germinate.'],
['Water cycle','What is the change from liquid water to water vapour called?','Evaporation','Freezing','Melting','Condensation','Evaporation changes liquid water into water vapour.'],
['Water cycle','Water droplets appear on the outside of a cold glass. Where do they come from?','Water vapour in the air condenses','Water leaks through solid glass','The glass produces water','Ice passes through the glass','Water vapour cools and condenses on the cold surface.'],
['Water cycle','Why does a wet shirt dry faster in moving air?','Moving air helps evaporation','Air creates new water','Water becomes a solid','The shirt stops containing matter','Moving air carries water vapour away, helping evaporation.'],
['Respiratory system','What is the main function of lungs?','Exchange gases with the air','Digest food','Pump blood','Make bones','Lungs allow oxygen to enter and carbon dioxide to leave the blood.'],
['Circulatory system','Which organ pumps blood around the body?','Heart','Stomach','Lungs','Small intestine','The heart pumps blood through blood vessels.'],
['Circulatory system','Why does the heart usually beat faster during exercise?','To deliver more oxygen and food to working muscles','To stop all breathing','To digest bones','To cool blood by turning it to ice','Working muscles require more oxygen and energy.'],
['Plant transport','What does the stem transport from roots towards leaves?','Water and mineral salts','Only sand','Only pollen','Only petals','Water-carrying tubes move water and mineral salts through the plant.'],
['Electrical system','When can a bulb light in a simple battery circuit?','When there is a complete conducting path','When a wire is disconnected','When both wires touch only one battery terminal','When the switch is open','A closed circuit allows electric current to flow.'],
['Electrical system','Which material can complete a circuit as a conductor?','Copper','Rubber','Dry plastic','Dry wood','Copper conducts electricity.'],
['Electrical system','What happens when the switch in a simple circuit is opened?','The bulb goes out','The battery gains unlimited energy','The bulb becomes brighter forever','The wires disappear','Opening the switch breaks the conducting path.'],
['Electrical system','Two identical bulbs share one series circuit. One is removed. What happens to the other?','It goes out','It always becomes twice as bright','It turns into a battery','It stays lit without a complete path','Removing a series bulb breaks the circuit.'],
['Inquiry','To compare evaporation from two containers, which variable can be tested?','The exposed surface area','All conditions at once','The answer written down','The name of the pupil','Change surface area while keeping other relevant conditions the same.']
],
6:[
['Photosynthesis','Which gas is used by a plant during photosynthesis?','Carbon dioxide','Helium','Nitrogen only','Carbon monoxide','Plants use carbon dioxide and water with light energy to make food.'],
['Photosynthesis','Which form of energy is needed for photosynthesis?','Light energy','Sound energy','Elastic energy','Nuclear energy from the soil','Light provides the energy for photosynthesis.'],
['Photosynthesis','Why is a leaf partly covered before a starch test?','To compare parts receiving light with parts without light','To make the leaf magnetic','To stop all water transport','To replace all the leaf cells','Covered and uncovered areas help investigate whether light is needed.'],
['Energy conversion','In a battery-powered torch, which useful conversion occurs?','Chemical energy to electrical energy to light','Light energy to chemical energy only','Sound energy to gravitational energy','Heat energy to food','Stored chemical energy supplies electricity, and the bulb produces light.'],
['Energy conversion','A stretched rubber band can move a toy when released. What energy was stored?','Elastic potential energy','Light energy','Sound energy only','Chemical energy from sunlight','Stretching the rubber band stores elastic potential energy.'],
['Energy conversion','A raised ball falls. What happens to its gravitational potential energy?','It decreases as kinetic energy increases','It increases while all motion stops','It becomes mass','It remains exactly unchanged','As the ball falls, stored gravitational energy is converted into kinetic energy.'],
['Forces','Which force pulls a falling object towards Earth?','Gravitational force','Magnetic force in every case','Elastic spring force','A force made by sunlight','Gravity pulls objects towards Earth.'],
['Forces','Why do bicycle brakes slow the wheels?','Friction opposes their motion','Gravity disappears','The wheels lose all mass','The brakes create sunlight','Friction between braking surfaces opposes motion.'],
['Forces','Which surface usually gives a shoe more grip?','A rough dry surface','A smooth wet surface','A smooth oily surface','Ice','A rough dry surface usually provides greater friction.'],
['Forces','What force does a stretched spring exert as it returns to its original length?','Elastic spring force','Photosynthesis','Condensation','Sound only','A stretched spring exerts an elastic restoring force.'],
['Environment','In grass → grasshopper → frog, what does the arrow show?','Energy transfer from food to consumer','Which animal is larger','Where rain falls','Which organism breathes fastest','Food-chain arrows point from a food source to the organism that eats it.'],
['Environment','Why are plants called producers?','They make their own food','They eat all other organisms','They do not need any matter','They are always the biggest organisms','Green plants make food using photosynthesis.'],
['Environment','What may happen to frogs if their insect food becomes scarce?','Their population may decrease','They immediately become plants','They no longer need food','Their population must always double','Less available food can reduce survival and reproduction.'],
['Environment','Which action best helps protect a pond habitat?','Keep litter and harmful chemicals out','Pour detergent into it','Remove every plant','Feed all animals plastic','Reducing pollution helps organisms survive in the habitat.'],
['Inquiry','Why should an experiment be repeated?','To check whether results are consistent','To guarantee a preferred answer','To avoid all observations','To change every variable','Repeated trials help identify unusual results and improve reliability.']
]};
for(const [grade,items] of Object.entries(SCIENCE))for(const [topic,q,a,b,c,d,explanation] of items)addMoe('Science',Number(grade),topic,q,a,[b,c,d],explanation);
const ENGLISH={
1:[
['Grammar','Choose the correct word: Mei ___ a book.','has','have','having','are','Use has with a singular subject such as Mei.'],
['Grammar','Choose the correct word: The boys ___ happy.','are','is','am','was','A plural subject takes are in the present tense.'],
['Vocabulary','Which word means the opposite of hot?','Cold','Warm','Bright','Fast','Cold is the opposite of hot.'],
['Vocabulary','Which word is an action word?','Jump','Table','Blue','Flower','Jump describes an action.'],
['Grammar','Choose the correct word: I saw ___ elephant.','an','a','theirs','many','Use an before a vowel sound.'],
['Grammar','Which is the plural of child?','Children','Childs','Childes','Childrens','Children is the irregular plural of child.'],
['Punctuation','Which mark normally ends a direct question?','Question mark','Comma','Apostrophe','Colon','A direct question normally ends with a question mark.'],
['Reading','Lina put her red bag under the chair. Where is her bag?','Under the chair','On the table','Behind the door','In the cupboard','The sentence explicitly tells us where the bag is.'],
['Reading','Ravi watered the plant before breakfast. What did he do first?','Watered the plant','Ate breakfast','Went to sleep','Read a book','Before tells us that watering happened first.'],
['Vocabulary','Which word best completes: The rabbit moved very ___.','quickly','table','green','door','Quickly describes how the rabbit moved.'],
['Grammar','Choose the correct word: Yesterday, I ___ to school.','walked','walk','walking','walks','Yesterday places the action in the past.'],
['Reading','The notice says: Keep the gate closed. What should you do after entering?','Close the gate','Leave it open','Remove the gate','Paint it','Follow the instruction by closing the gate.'],
['Vocabulary','Which word means very small?','Tiny','Huge','Heavy','Noisy','Tiny means very small.'],
['Punctuation','Which sentence starts with a capital letter?','We like reading.','we like reading.','wE like reading.','we Like reading.','The first word in a sentence starts with a capital letter.'],
['Reading','Amir has two blue pens and one red pen. How many pens does he have?','Three','One','Two','Four','Two plus one gives three pens.']
],
3:[
['Grammar','Choose the correct word: Neither of the answers ___ correct.','is','are','were','be','Neither refers to one of the two alternatives and takes is here.'],
['Grammar','Choose the correct word: She has ___ her homework.','finished','finish','finishing','finishes','Has is followed by the past participle finished.'],
['Vocabulary','Which word is closest in meaning to cautious?','Careful','Careless','Noisy','Sleepy','A cautious person acts carefully.'],
['Vocabulary','Choose the best word: The glass is fragile, so carry it ___.','carefully','angrily','loudly','hungrily','Fragile means easily broken, so careful handling is needed.'],
['Grammar','Choose the correct conjunction: It was raining, ___ we stayed indoors.','so','although','unless','but','So connects the rain with its result.'],
['Grammar','Choose the correct word: There is ___ water in the cup.','some','many','a few','these','Water is uncountable; some fits the sentence.'],
['Reading','Maya took an umbrella after seeing dark clouds. Why did she take it?','She expected rain','She wanted to swim','She was carrying groceries','She needed a new pen','Dark clouds suggest possible rain.'],
['Reading','A sign reads: Library closes at 5 p.m. Ben arrives at 4:45 p.m. How much time remains?','15 minutes','45 minutes','One hour','Two hours','The interval from 4:45 to 5:00 is 15 minutes.'],
['Writing','Which phrase is the most suitable start to a polite request?','Could you please','Give me now','You must obey','I demand it','Could you please makes a respectful request.'],
['Grammar','Choose the correct pronoun: This bag belongs to Sara. It is ___.','hers','her','she','herself','Hers is the possessive pronoun used on its own.'],
['Vocabulary','Which word means the opposite of generous?','Stingy','Helpful','Friendly','Cheerful','Stingy describes unwillingness to share or spend.'],
['Reading','A recipe says to wash vegetables before cutting them. What comes first?','Washing','Cutting','Cooking','Serving','Before signals the required order.'],
['Punctuation','Which punctuation correctly separates items in a simple list?','Commas','Question marks','Apostrophes','Full stops between every word','Commas separate the items within a sentence.'],
['Grammar','Choose the correct word: If you heat ice, it ___.','melts','melt','melting','have melted','It takes the singular present-tense verb melts.'],
['Reading','Jia searched under the bed, then smiled while holding her missing toy. What can we infer?','She found the toy','She lost another toy','She was asleep','She broke the bed','The smile and the toy in her hand support this inference.']
],
5:[
['Grammar','Choose the correct word: Each of the pupils ___ a role.','has','have','are','were','Each is singular and takes has.'],
['Grammar','Choose the correct phrase: By the time we arrived, the bus ___.','had left','leaves','leaving','has leave','The past perfect shows that the departure happened before another past event.'],
['Grammar','Choose the correct phrase: If I had checked the timetable, I ___ the bus.','would not have missed','will not miss','do not miss','am not missing','This sentence describes an unreal past condition and consequence.'],
['Vocabulary','Which word best replaces reluctant?','Unwilling','Delighted','Certain','Careless','Reluctant means unwilling or hesitant.'],
['Vocabulary','In “The news lifted her spirits”, what does lifted her spirits mean?','Made her feel happier','Moved her physically upwards','Made her angry','Made her fall asleep','This expression describes an improvement in mood.'],
['Reading','“Although the path was steep, Noor continued climbing.” What does this suggest?','Noor was determined','Noor had stopped permanently','The path was flat','Noor disliked all exercise','Continuing despite difficulty suggests determination.'],
['Reading','An advertisement says a drink is “the best in the world” without evidence. How should a reader respond?','Treat the claim critically','Assume it is proven','Believe every advertisement','Ignore all facts','A strong advertising claim needs evidence before it can be accepted as fact.'],
['Writing','Which opening is most suitable for a formal email to a teacher?','Dear Ms Tan,','Hey you!','Yo!','Listen now!','A formal greeting is appropriate for the audience.'],
['Writing','Which sentence gives a clear reason for an opinion?','We should reuse bottles because it reduces waste.','Reuse bottles now.','Bottles exist.','I like them.','Because introduces a reason supporting the recommendation.'],
['Grammar','Choose the correct conjunction: ___ he was tired, he completed the task.','Although','Because','So','Unless','Although contrasts tiredness with completing the task.'],
['Reading','A report records that 18 out of 20 pupils preferred option A. Which conclusion is supported?','Most surveyed pupils preferred A','All children everywhere prefer A','Nobody preferred A','Option A must be free','The evidence supports a statement about the surveyed group only.'],
['Vocabulary','Which word is closest in meaning to significant?','Important','Tiny','Accidental','Invisible','Significant commonly means important in this context.'],
['Grammar','Which sentence uses the passive voice?','The window was cleaned by Amir.','Amir cleaned the window.','Amir is cleaning the window.','Amir will clean the window.','The passive sentence places the receiver of the action first.'],
['Reading','Two accounts of the same event disagree. What is the best next step?','Compare their evidence and sources','Choose the longer account automatically','Believe both details without checking','Ignore the event entirely','Comparing sources and evidence helps evaluate conflicting accounts.'],
['Writing','Which sentence best links a contrasting idea?','However, another solution may work better.','First, the door is blue.','Also, we bought apples.','For example, this is a pencil.','However signals a contrast with the previous idea.']
]};
for(const [start,items] of Object.entries(ENGLISH))for(const grade of [Number(start),Number(start)+1])for(const [topic,q,a,b,c,d,explanation] of items)addMoe('English',grade,topic,q,a,[b,c,d],explanation);
function moePool(subject,grade,topic='All'){const seen=new Set();return MOE_BANK.filter(item=>{if(item.subject!==subject||item.grade!==grade||(topic!=='All'&&item.topic!==topic)||seen.has(item.q))return false;seen.add(item.q);return true});}
function moeTest(subject,grade,topic,count){const pool=moePool(subject,grade,topic).map(item=>({...item,choices:[...item.choices]}));for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return pool.slice(0,count).map(item=>{for(let i=item.choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[item.choices[i],item.choices[j]]=[item.choices[j],item.choices[i]]}return item});}
