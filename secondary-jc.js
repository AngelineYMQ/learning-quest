'use strict';
// Original authored practice sequences; schools may teach topics in a different year.
// Only populated year/subject banks are offered. Existing grade-0 banks remain for saved sessions.
let advancedId=0;
const ADVANCED_TRACKS={secondary:{Math:'G3',English:'G3',Physics:'G3',Chemistry:'G3',Biology:'G3',Computing:'G3',Science:'Lower secondary'},jc:{Math:'H2',Physics:'H2',Chemistry:'H2',Biology:'H2',Computing:'H2','General Paper':'H1',Economics:'H1'}};
function addAdvanced(stage,subject,grade,topic,q,a,wrong,explanation){
 a=String(a);const choices=[...new Set([a,...wrong.map(String)])];if(choices.length!==4)throw Error('Invalid advanced choices: '+q);
 SCHOOL_BANK.push({id:'advanced-'+advancedId++,stage,subject,grade,topic,q,a,choices,explanation,source:schoolCourse(stage,subject).source,track:ADVANCED_TRACKS[stage][subject]});
}
function advancedNumeric(stage,subject,grade,topic,q,a,explanation,unit=''){
 const rounded=n=>Number(n.toFixed(5));const answer=rounded(a),wrong=[rounded(answer+1),rounded(answer+3),rounded(answer+7)];
 addAdvanced(stage,subject,grade,topic,q,answer+unit,wrong.map(n=>n+unit),explanation);
}
schoolCourse('jc','Math').source={title:'2024 Pre-University H2 Mathematics',url:'https://www.moe.gov.sg/-/media/files/post-secondary/syllabuses/maths/2024-pre-university-h2-mathematics.pdf'};
for(let n=2;n<=31;n++){
 advancedNumeric('secondary','Math',1,'Algebra',`Solve x + ${n} = ${3*n+1}.`,2*n+1,`Subtract ${n} from both sides.`);
 advancedNumeric('secondary','Math',1,'Integers',`Evaluate ${n} − ${2*n+3}.`,-n-3,'Subtract the larger integer, keeping the negative sign.');
 advancedNumeric('secondary','Math',1,'Fractions',`A ribbon is ${6*n} cm long. What is 2/3 of its length?`,4*n,'Multiply the length by 2/3.',' cm');
 advancedNumeric('secondary','Math',2,'Linear equations',`Solve ${n}x + ${n+2} = ${n*4+n+2}.`,4,`Subtract ${n+2}, then divide by ${n}.`);
 advancedNumeric('secondary','Math',2,'Ratios',`Two quantities are in the ratio 2:3 and total ${5*n}. What is the larger quantity?`,3*n,'Divide the total into five equal parts, then take three parts.');
 advancedNumeric('secondary','Math',2,'Percentages',`A price of $${10*n} increases by 20%. Find the new price.`,12*n,'Multiply the original price by 1.2.');
 advancedNumeric('secondary','Math',3,'Quadratic equations',`The equation (x − ${n})(x + ${n+1}) = 0 has one positive root. What is it?`,n,'A product is zero when either factor is zero.');
 advancedNumeric('secondary','Math',3,'Pythagoras',`A right triangle has perpendicular sides ${3*n} cm and ${4*n} cm. Find its hypotenuse.`,5*n,'Use c² = a² + b².',' cm');
 advancedNumeric('secondary','Math',3,'Coordinate geometry',`Find the gradient through (0, ${n}) and (2, ${n+6}).`,3,'Gradient is change in y divided by change in x.');
 advancedNumeric('secondary','Math',4,'Sequences',`An arithmetic sequence starts at ${n} and increases by 4 each term. Find its tenth term.`,n+36,'The tenth term is a + 9d.');
 advancedNumeric('secondary','Math',4,'Statistics',`Find the mean of ${n}, ${n+2}, ${n+4}, ${n+6}.`,n+3,'Add all four values and divide by four.');
 advancedNumeric('secondary','Math',4,'Probability',`A bag contains ${n} red counters and ${n} blue counters. What is the probability of drawing a red counter, as a percentage?`,50,'The red counters are half the total.','%');
 advancedNumeric('jc','Math',1,'Differentiation',`For f(x) = ${n}x² + 3x, find f′(2).`,4*n+3,'Differentiate to get f′(x) = 2ax + 3, then substitute x = 2.');
 advancedNumeric('jc','Math',1,'Sequences and series',`An arithmetic progression has first term ${n} and common difference 2. Find the sum of its first 10 terms.`,10*n+90,'Use Sₙ = n[2a + (n−1)d]/2.');
 advancedNumeric('jc','Math',1,'Functions',`For f(x) = 3x − ${n}, find f⁻¹(${n}).`,2*n/3,'Rearrange y = 3x − a to x = (y + a)/3. Round to 5 decimal places where needed.');
 advancedNumeric('jc','Math',2,'Integration',`Evaluate ∫₀¹ ${n}x² dx. Round to 5 decimal places where needed.`,n/3,'The antiderivative is ax³/3. Evaluate at 1 and 0.');
 advancedNumeric('jc','Math',2,'Vectors',`Find the scalar product of (${n}, 2, 1) and (3, 1, 4).`,3*n+6,'Multiply corresponding components and sum them.');
 advancedNumeric('jc','Math',2,'Probability',`A discrete variable X is ${n} or ${n+4}, each with probability 0.5. Find E(X).`,n+2,'Sum each value multiplied by its probability.');
 advancedNumeric('secondary','Physics',3,'Mechanics',`An object travels ${4*n} m in ${n} s at constant speed. Find its speed.`,4,'Speed = distance / time.',' m/s');
 advancedNumeric('secondary','Physics',3,'Forces',`A resultant force acts on a ${n} kg mass, producing acceleration 3 m/s². Find the force.`,3*n,'Use F = ma.',' N');
 advancedNumeric('secondary','Physics',3,'Energy',`A constant force of ${n} N moves an object 5 m along the force. Find the work done.`,5*n,'Work = force × displacement in the force direction.',' J');
 advancedNumeric('jc','Physics',1,'Kinematics',`An object has initial velocity 3 m/s and constant acceleration 2 m/s². Find its displacement in ${n} s.`,3*n+n*n,'Use s = ut + ½at².',' m');
 advancedNumeric('jc','Physics',1,'Momentum',`A ${n} kg object moves at 3 m/s and sticks to a stationary 2 kg object. Find the shared velocity, to 5 decimal places where needed.`,3*n/(n+2),'Conserve momentum: nv = (n+2)V, with initial v = 3 m/s.',' m/s');
 advancedNumeric('jc','Physics',1,'Circular motion',`A body moves at 2 m/s around a circle of radius ${n} m. Find its centripetal acceleration, to 5 decimal places where needed.`,4/n,'Use a = v²/r.',' m/s²');
 advancedNumeric('secondary','Physics',4,'Electricity',`A ${n} Ω resistor carries a current of 2 A. Find the potential difference.`,2*n,'Use V = IR.',' V');
 advancedNumeric('secondary','Physics',4,'Waves',`A wave has frequency ${n} Hz and wavelength 3 m. Find its speed.`,3*n,'Wave speed = frequency × wavelength.',' m/s');
 advancedNumeric('secondary','Physics',4,'Electrical power',`A device draws 2 A from a ${n} V supply. Find its power.`,2*n,'Electrical power P = VI.',' W');
 advancedNumeric('jc','Physics',2,'Electric fields',`A charge of 2 C experiences ${n} N in a uniform electric field. Find the field strength.`,n/2,'Field strength E = F/q.',' N/C');
 advancedNumeric('jc','Physics',2,'Capacitance',`A capacitor stores ${2*n} μC at a potential difference of 2 V. Find its capacitance.`,n,'C = Q/V; microcoulombs divided by volts give microfarads.',' μF');
 advancedNumeric('jc','Physics',2,'Radioactivity',`A sample has activity ${8*n} Bq initially. What remains after two half-lives?`,2*n,'Two half-lives leave one quarter of the initial activity.',' Bq');
 advancedNumeric('secondary','Chemistry',3,'Atomic structure',`A neutral atom has ${n} protons. How many electrons does it have?`,n,'A neutral atom has equal numbers of protons and electrons.');
 advancedNumeric('secondary','Chemistry',3,'Formulae and moles',`A substance has molar mass 20 g/mol. How many moles are in ${20*n} g?`,n,'Moles = mass / molar mass.',' mol');
 advancedNumeric('secondary','Chemistry',3,'Particle structure',`An atom has ${n} protons and ${n+2} neutrons. Find its mass number.`,2*n+2,'Mass number = protons + neutrons.');
 advancedNumeric('secondary','Chemistry',4,'Solutions',`A solution contains ${n} mol of solute in 2 dm³. Find its concentration.`,n/2,'Concentration = amount / volume.',' mol/dm³');
 advancedNumeric('secondary','Chemistry',4,'Reaction stoichiometry',`For 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from ${2*n} mol H₂ with sufficient oxygen?`,2*n,'The mole ratio of hydrogen to water is 1:1.',' mol');
 advancedNumeric('secondary','Chemistry',4,'Gas volumes',`Using a molar gas volume of 24 dm³/mol, find the volume of ${n} mol of gas.`,24*n,'Volume = amount × molar gas volume.',' dm³');
 advancedNumeric('jc','Chemistry',1,'Stoichiometry',`A solute has molar mass 50 g/mol. Calculate the moles in ${5*n} g.`,n/10,'Amount = mass / molar mass.',' mol');
 advancedNumeric('jc','Chemistry',1,'Energetics',`A reaction releases 40 kJ per mole reacted. Calculate ΔH for ${n} mol reacting.`,-40*n,'Released heat has a negative enthalpy change.',' kJ');
 advancedNumeric('jc','Chemistry',1,'Solutions',`${n} mol of solute is dissolved to make 0.5 dm³ of solution. Find its concentration.`,2*n,'Concentration = n/V.',' mol/dm³');
 advancedNumeric('jc','Chemistry',2,'Equilibrium',`For A ⇌ B, equilibrium concentrations are [A] = 2 mol/dm³ and [B] = ${2*n} mol/dm³. Find Kc.`,n,'For this 1:1 reaction, Kc = [B]/[A].');
 advancedNumeric('jc','Chemistry',2,'Reaction kinetics',`A reaction is first order in A. Increasing [A] by a factor of ${n} changes the rate by what factor?`,n,'For first order, rate is directly proportional to concentration.');
 advancedNumeric('jc','Chemistry',2,'Electrochemistry',`A current of ${n} A flows for 10 s. How much charge passes?`,10*n,'Q = It.',' C');
 for(const year of [1,2])advancedNumeric('secondary','Science',year,year===1?'Measurement':'Density',year===1?`Convert ${n} cm into millimetres.`:`An object has mass ${3*n} g and volume ${n} cm³. Find its density.`,year===1?10*n:3,year===1?'One centimetre equals ten millimetres.':'Density = mass / volume.',year===1?' mm':' g/cm³');
 for(const year of [3,4])advancedNumeric('secondary','Computing',year,year===3?'Binary numbers':'Algorithms',year===3?`What is the decimal value of binary ${n.toString(2)}?`:`A loop runs ${n} times and increments a counter by 3 each time from zero. What is the final counter?`,year===3?n:3*n,year===3?'Use binary place values.':'Multiply the increment by the number of iterations.');
 for(const year of [1,2])advancedNumeric('jc','Computing',year,year===1?'Data representation':'Algorithms',year===1?`An unsigned binary integer uses ${n%6+3} bits. How many distinct values can it represent?`:`A binary search repeatedly halves a sorted array of 2^${n%8+2} items. How many halvings reduce it to one item?`,year===1?2**(n%6+3):n%8+2,year===1?'k bits encode 2^k distinct bit patterns.':'Halving a power-of-two size reduces its exponent by one.');
 advancedNumeric('jc','Economics',1,'Demand and supply',`A linear demand curve is Qd = ${10*n} − 2P and supply is Qs = 2P. Find the equilibrium price.`,2.5*n,'Set Qd = Qs and solve 4P = the demand intercept.');
 advancedNumeric('jc','Economics',2,'Macroeconomic measures',`In a simplified economy, C=${n}, I=10, G=20, exports=15 and imports=5. Find GDP by expenditure.`,n+40,'GDP = C + I + G + (X−M).');
}
const ENGLISH_ACTIONS=[['writes','write','wrote','written','a report'],['draws','draw','drew','drawn','a picture'],['takes','take','took','taken','a photograph'],['makes','make','made','made','a model'],['reads','read','read','read','a novel'],['finds','find','found','found','a solution'],['chooses','choose','chose','chosen','a route'],['builds','build','built','built','a bridge'],['brings','bring','brought','brought','a notebook'],['buys','buy','bought','bought','a ticket'],['sees','see','saw','seen','a rainbow'],['gives','give','gave','given','a presentation'],['sends','send','sent','sent','a message'],['keeps','keep','kept','kept','a journal'],['wears','wear','wore','worn','a jacket'],['hears','hear','heard','heard','a sound'],['holds','hold','held','held','a meeting'],['wins','win','won','won','a prize'],['loses','lose','lost','lost','a key'],['catches','catch','caught','caught','a bus']];
for(const [i,v] of ENGLISH_ACTIONS.entries())for(const who of ['The pupil','The editor','The volunteer']){
 const [present,base,past,part,obj]=v;
 const distract=(answer,candidates)=>{const w=[...new Set(candidates.filter(x=>x!==answer))];for(const x of ['to '+base,base+'ing','will '+base])if(x!==answer&&!w.includes(x))w.push(x);return w.slice(0,3)};
 addAdvanced('secondary','English',1,'Grammar',`Choose the correct form: “${who} usually ____ ${obj}.”`,present,distract(present,[base,past,part]),'A singular subject uses the third-person singular present form with usually.');
 addAdvanced('secondary','English',2,'Past tense',`Choose the simple past: “${who} ____ ${obj} yesterday.”`,past,distract(past,[present,'will '+base,'has '+part]),'Yesterday places this completed action in the past.');
 addAdvanced('secondary','English',3,'Perfect aspect',`Complete the present perfect: “${who} has ____ ${obj}.”`,part,distract(part,[present,base,'to '+base]),'Has is followed by a past participle in the present perfect.');
}
// Grade 4 passive examples must not differ only by an irrelevant original action.
for(const [present,base,past,part,obj] of ENGLISH_ACTIONS)for(const name of ['Maya','Daniel','Aisha']){
 const sentence=`${name} ${present} ${obj}.`,answer=`${obj[0].toUpperCase()+obj.slice(1)} is ${part} by ${name}.`;
 addAdvanced('secondary','English',4,'Passive voice',`Choose the correct passive form of “${sentence}”`,answer,[`${obj[0].toUpperCase()+obj.slice(1)} is ${present} by ${name}.`,`${name} is ${part} by ${obj}.`,`${obj[0].toUpperCase()+obj.slice(1)} are ${part} by ${name}.`],'Present passive uses a singular object as subject, is, and the past participle.');
}
for(let n=2;n<=31;n++){
 for(const stage of ['secondary','jc']){
 const year=stage==='secondary'?3:1;
 advancedNumeric(stage,'Biology',year,'Microscopy',`An image of a cell is ${n} mm long. Its actual length is 0.005 mm. Find the magnification.`,200*n,'Magnification = image size / actual size; both lengths use the same unit.');
 if(stage==='secondary')advancedNumeric(stage,'Biology',year,'DNA composition',`In double-stranded DNA, guanine makes up ${n}% of bases. What percentage is adenine?`,50-n,'G pairs with C and A pairs with T. A = (100 − 2G)/2.','%');else advancedNumeric(stage,'Biology',year,'Molecular biology',`A linear double-stranded DNA fragment has ${n} nucleotides in each strand. How many phosphodiester bonds join nucleotides within the two strands altogether?`,2*(n-1),'Each linear strand of n nucleotides has n−1 phosphodiester bonds. Count both strands.');
 }
 advancedNumeric('secondary','Biology',4,'Inheritance',`Two heterozygous parents Aa × Aa produce ${4*n} offspring in a probability model. How many aa offspring are expected?`,n,'Each offspring has probability 1/4 of aa; multiply the total by 1/4.');
 advancedNumeric('secondary','Biology',4,'Ecology',`Producers contain ${100*n} kJ. If 10% transfers to primary consumers, how much energy transfers?`,10*n,'Apply the stated transfer fraction, 0.1.',' kJ');
 advancedNumeric('jc','Biology',2,'Population genetics',`In a Hardy–Weinberg model, allele a has frequency ${n/100}. Find the heterozygote frequency as a percentage.`,2*(n/100)*(1-n/100)*100,'Heterozygote frequency is 2pq, with p = 1−q.','%');
 advancedNumeric('jc','Biology',2,'Genetic linkage',`In a test cross, ${n} offspring have one recombinant phenotype and ${n} the other. There are 200 offspring altogether. Find the recombination frequency.`,n,'Recombination frequency = recombinant offspring / all offspring × 100%.','%');
 addAdvanced('jc','Computing',1,'Data representation',`What is the 8-bit two’s-complement representation of −${n}?`,(256-n).toString(2).padStart(8,'0'),[n.toString(2).padStart(8,'0'),(255-n).toString(2).padStart(8,'0'),(257-n).toString(2).padStart(8,'0')],'For a negative integer −n in eight bits, use 256−n and encode it in binary.');
 advancedNumeric('jc','Computing',2,'Algorithms',`A counter starts at 1. A loop doubles it exactly ${n} times. What is its final value?`,2**n,'Repeated doubling from one gives 2 to the power of the iteration count.');
}
function advancedYears(stage,subject){return [...new Set(SCHOOL_BANK.filter(q=>q.stage===stage&&q.subject===subject&&q.grade>0).map(q=>q.grade))].sort((a,b)=>a-b)}
function advancedLabel(stage,subject,grade){return (stage==='secondary'?'Secondary ':'JC ')+grade+' · '+(ADVANCED_TRACKS[stage]?.[subject]||'Practice')}
const GP_ARGUMENTS=[
['Library visits rose after opening hours were extended. The writer argues that longer hours caused the increase.','Longer opening hours caused more visits.','Whether other changes also encouraged visits.','A book promotion started at the same time.'],
['Students who volunteer report greater confidence. A writer recommends volunteering to improve confidence.','Volunteering may improve confidence.','Whether confident students were already more likely to volunteer.','The survey did not measure confidence before volunteering.'],
['A small survey of cyclists supports closing a road to cars. The writer says all residents agree.','All residents support closing the road.','Whether cyclists represent the views of all residents.','Many residents who drive were not surveyed.'],
['One shop lowered prices and sold more items. The writer concludes all shops should cut prices.','Price cuts are recommended for every shop.','Whether profit and operating costs were considered.','Sales rose but profit fell because margins became smaller.'],
['An app has many downloads. Its creator says this proves the app improves learning.','Downloads are presented as proof of learning benefits.','Whether downloads measure actual learning outcomes.','Many users downloaded it but never completed a lesson.'],
['A park was renovated and nearby house prices rose. The writer attributes the rise entirely to the park.','The park renovation is said to explain the whole price rise.','Whether other factors changed property prices.','A new train station also opened nearby.'],
['A successful athlete used a particular training plan. An advert promises that anyone using it will become a champion.','One training plan supposedly guarantees championship success.','Whether an individual success justifies a universal guarantee.','Many athletes used the plan without winning championships.'],
['A poll on a museum’s website finds strong support for more museum funding. The author calls it a representative public poll.','The website poll is claimed to represent the public.','Whether people interested in museums self-selected into the poll.','The respondents mostly visited the museum regularly.'],
['A company’s waste fell after recycling bins were installed. It claims the bins alone explain the reduction.','Recycling bins are presented as the sole reason for less waste.','Whether production or consumption also changed.','The company produced fewer goods during the same period.'],
['A school team won after changing its captain. A report says the new captain alone caused the win.','The captain change is said to have caused the win alone.','Whether opponents and other team changes mattered.','The winning match was against a much weaker opponent.'],
['A writer opposes all online courses because one course gave poor feedback.','One poor course is used to reject all online courses.','Whether one course represents all online courses.','Other online courses provide detailed feedback and strong results.'],
['A device costs more than its competitors. Its advertisement claims higher price guarantees higher quality.','Higher price is said to guarantee higher quality.','Whether independent quality measures support the claim.','Cheaper devices perform equally well in independent tests.'],
['A report says users like a service because only satisfied customers submitted reviews.','Reviews from satisfied users are treated as evidence of general satisfaction.','Whether dissatisfied users were excluded from the evidence.','Complaints from unhappy customers were not counted.'],
['Traffic was lighter during a public holiday. A writer credits a new traffic rule introduced that day.','The new rule is credited for lighter traffic.','Whether the public holiday reduced travel independently.','Similar holidays had light traffic before the rule existed.'],
['A writer says a policy must be correct because a famous actor supports it.','Celebrity support is presented as proof that a policy is correct.','Whether the actor’s support provides relevant evidence.','Relevant evidence contradicts the policy’s claimed benefits.'],
['A restaurant has a long queue. A blogger concludes every dish there must be excellent.','A queue is used to claim every dish is excellent.','Whether popularity proves the quality of every dish.','Some people queued only because of a temporary discount.'],
['A proposal claims a new playground will benefit residents without discussing its maintenance costs.','The playground is expected to benefit residents.','Whether benefits exceed ongoing costs and other uses of the money.','Maintenance expenses would displace an essential existing service.'],
['A writer says people either accept every new technology or oppose progress.','Only total acceptance or opposition is offered.','Whether selective acceptance is a reasonable third position.','People may accept useful technologies while rejecting harmful uses.'],
['A survey finds a link between screen time and poor sleep. A headline says screens are the only cause of poor sleep.','Screen time is presented as the sole cause of poor sleep.','Whether a correlation establishes the only cause.','Stress and irregular work schedules also predict poor sleep.'],
['An article argues that an idea is wrong because its author once made an unrelated mistake.','The author’s unrelated mistake is used to reject the idea.','Whether the criticism addresses the idea’s evidence.','Independent evidence supports the idea despite the author’s mistake.']
];
for(const [text,claim,limit,counter] of GP_ARGUMENTS){
 addAdvanced('jc','General Paper',1,'Argument comprehension',`Read: “${text}” What claim is made?`,claim,['The paragraph proves there are no alternatives.','The paragraph states that no evidence exists anywhere.','The paragraph only defines a dictionary term.'],'Choose the claim actually presented, rather than adding an unsupported conclusion.');
 addAdvanced('jc','General Paper',1,'Evidence and interpretation',`Read: “${text}” Which question would help examine the reasoning?`,limit,['What colour is the author’s pen?','How many letters are in the title?','Was the paragraph printed in large type?'],'Examine the relationship between the evidence and the conclusion.');
 addAdvanced('jc','General Paper',2,'Critical evaluation',`Evaluate: “${text}” Which finding most directly challenges the reasoning?`,counter,['Independent evidence confirms the reported result.','An explanation shows why the proposed benefit matters socially.','Readers express support for investigating the issue further.'],'A relevant counterexample targets the inference, not the presentation.');
 addAdvanced('jc','General Paper',2,'Qualified conclusions',`Read: “${text}” Which response is most defensible?`,'Treat the conclusion as provisional until relevant alternatives are assessed.',['Accept it automatically because it is written confidently.','Reject every possible related claim without examining evidence.','Judge its truth solely from the length of the paragraph.'],'A qualified conclusion recognises what the evidence can and cannot establish.');
}
