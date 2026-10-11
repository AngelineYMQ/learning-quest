// Higher difficulties use concepts and multi-step reasoning, not just larger numbers.
function challengingQuestion(subject, level) {
  const integer = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = items => items[integer(0, items.length - 1)];
  const numeric = (q, answer, distractors) => {
    const a = String(answer);
    const choices = [...new Set([a, ...distractors.map(String)])];
    for (let offset = 1; choices.length < 4; offset++) {
      const candidate = String(Number(answer) + offset);
      if (!choices.includes(candidate)) choices.push(candidate);
    }
    return { q, a, choices: choices.slice(0, 4) };
  };
  const n = integer(2, 9), m = integer(2, 8), k = integer(2, 6);
  let result;
  if (subject === 'Math') {
    const questions = level === 4 ? [
      () => numeric(`Solve for x: ${n}x + ${m} = ${n*k+m}.`, k, [k+1, -k, n*k]),
      () => numeric(`A rectangle has perimeter ${2*(n+m)} cm and length ${n} cm. What is its area in cm²?`, n*m, [n+m, 2*n*m, m]),
      () => numeric(`Evaluate ${n}² − ${m} × ${k}.`, n*n-m*k, [(n*n-m)*k, n*n+m*k, n*n-m-k])
    ] : level === 5 ? [
      () => numeric(`The roots of x² − ${n+m}x + ${n*m} = 0 are positive. What is the larger root?`, Math.max(n,m), [n+m, n*m, -Math.max(n,m)]),
      () => numeric(`Solve the system: x + y = ${n+m}; ${k}x − y = ${k*n-m}. What is x?`, n, [m, n+m, -n]),
      () => numeric(`A price rises by 20%, then falls by 20%. Starting at ${25*n}, what is the final price?`,24*n,[25*n,20*n,30*n])
    ] : level === 6 ? [
      () => numeric(`For f(x) = ${n}x³ − ${m}x, evaluate f′(${k}).`,3*n*k*k-m,[n*k*k-m,3*n*k*k+m,n*k*k*k-m*k]),
      () => numeric(`An arithmetic sequence starts at ${n}, with common difference ${m}. Find the sum of its first 20 terms.`,10*(2*n+19*m),[20*(n+19*m),10*(2*n+20*m),20*n+19*m]),
      () => numeric(`A circle has radius ${n}. A sector subtends 120°. Express its area as cπ. What is c?`,n*n/3,[n*n,2*n*n/3,n/3])
    ] : level === 7 ? [
      () => numeric(`For f(x) = x³ − ${3*n*n}x, what is the positive x-coordinate of a stationary point?`,n,[3*n,n*n,-n]),
      () => numeric(`Evaluate ∫₀² (${3*n}x² + ${m}) dx.`,8*n+2*m,[12*n+2*m,8*n+m,6*n+2*m]),
      () => numeric(`A geometric series starts at ${n} and has ratio 1/2. Find its infinite sum.`,2*n,[n/2,n,4*n])
    ] : [
      () => numeric(`Evaluate ∫₀¹ ${12*n}x²(1 − x) dx.`,n,[2*n,3*n,4*n]),
      () => numeric(`How many onto functions exist from a set of ${k+2} elements to a set of 2 elements?`,2**(k+2)-2,[2**(k+2),2**(k+1),2**(k+2)-1]),
      () => numeric(`A fair coin is tossed ${n+3} times. Given that the first toss is heads, how many possible sequences have exactly 3 heads in total?`,(n+2)*(n+1)/2,[(n+3)*(n+2)*(n+1)/6,n+2,(n+2)*(n+1)]),
      () => numeric(`For f(x) = x²eˣ, express f″(${k}) as ce^${k}. What is c?`,k*k+4*k+2,[k*k+2*k,k*k+2,k*k+4*k]),
      () => numeric(`Two positive roots r and s satisfy r + s = ${n+m} and rs = ${n*m}. What is r³ + s³?`,n**3+m**3,[(n+m)**3,n**3-m**3,n*m*(n+m)])
    ];
    result = pick(questions)();
  } else if (subject === 'Science') {
    const questions = level === 4 ? [
      () => numeric(`A ${n} kg object accelerates at ${m} m/s². What net force acts on it, in newtons?`,n*m,[n+m,n/m,m/n]),
      () => numeric(`A circuit has resistance ${n} Ω and current ${m} A. What voltage is applied?`,n*m,[n/m,m/n,n+m])
    ] : level === 5 ? [
      () => numeric(`A ${n} kg object moves at ${2*m} m/s. What is its kinetic energy in joules?`,2*n*m*m,[n*2*m,n*4*m*m,n*m*m]),
      () => numeric(`A wave has frequency ${20*n} Hz and wavelength ${m} m. What is its speed in m/s?`,20*n*m,[20*n/m,20*n+m,m/(20*n)])
    ] : level === 6 ? [
      () => numeric(`A radioactive sample begins at ${16*n} g. How many grams remain after 4 half-lives?`,n,[4*n,2*n,8*n]),
      () => numeric(`Resistors of ${2*n} Ω and ${2*n} Ω are connected in parallel. Find the equivalent resistance in Ω.`,n,[4*n,2*n,n/2])
    ] : level === 7 ? [
      () => numeric(`A gas is compressed isothermally from ${n*m} L to ${n} L. Initial pressure is ${k} atm. What is the final pressure in atm?`,k*m,[k/m,k*n,k+m]),
      () => numeric(`A solution has [H⁺] = 10⁻${n} mol/L at 25°C. What is its pOH?`,14-n,[n,14+n,7-n])
    ] : [
      () => numeric(`A population is in Hardy–Weinberg equilibrium. The recessive phenotype frequency is 0.16. What percentage are heterozygous?`,48,[16,32,64]),
      () => numeric(`A first-order reaction has rate constant ln(2)/${n} s⁻¹. What fraction remains after ${3*n} seconds?`,0.125,[0.25,0.375,0.5]),
      () => numeric(`A capacitor stores ${n} joules at voltage V. The voltage becomes 3V with capacitance unchanged. What energy does it store?`,9*n,[3*n,6*n,n/3]),
      () => numeric(`For a reaction, doubling [A] quadruples the rate, while doubling [B] doubles it. What is the overall reaction order?`,3,[1,2,4])
    ];
    result = pick(questions)();
  } else if (subject === 'Coding') {
    const questions = level === 4 ? [
      () => numeric(`JavaScript: let s = 0; for (let i = 1; i <= ${n}; i++) s += i; What is s?`,n*(n+1)/2,[n*n,n*(n-1)/2,n]),
      () => numeric(`JavaScript: [${n}, ${m}, ${k}].map(x => x * 2).reduce((a,b) => a+b, 0). What is returned?`,2*(n+m+k),[n+m+k,n*m*k,2*n*m*k])
    ] : level === 5 ? [
      () => numeric(`JavaScript: function f(n) { return n <= 1 ? 1 : n * f(n-1); } What is f(${k})?`,Array.from({length:k},(_,i)=>i+1).reduce((a,b)=>a*b,1),[k*k,2**k,k*(k+1)/2]),
      () => numeric(`JavaScript: let a = [${n}]; let b = a; b.push(${m}); What is a.length?`,2,[1,0,3])
    ] : level === 6 ? [
      () => numeric(`JavaScript: let s = 0; for (let i=0;i<${n};i++) for(let j=0;j<i;j++) s++; What is s?`,n*(n-1)/2,[n*n,n*(n+1)/2,n-1]),
      () => numeric(`JavaScript: const a = [[${n}]]; const b = [...a]; b[0][0] = ${m+10}; What is a[0][0]?`,m+10,[n,m,0])
    ] : level === 7 ? [
      () => numeric(`JavaScript: function f(n) { if(n===0) return 1; return f(n-1)+f(n-1); } What is f(${k+3})?`,2**(k+3),[2*(k+3),(k+3)**2,2**(k+2)]),
      () => numeric(`JavaScript: let count=0; for(let i=1;i<${2**n};i*=2) count++; What is count?`,n,[n+1,2**n,n-1])
    ] : [
      () => numeric(`JavaScript: let c=0; for(let i=1;i<=${n};i++) for(let j=i;j<=${n};j+=i) c++; What is c?`,Array.from({length:n},(_,i)=>Math.floor(n/(i+1))).reduce((a,b)=>a+b,0),[n*n,n*(n+1)/2,n]),
      () => numeric(`JavaScript: function f(n) { if(n<2) return n; return f(n-1)+f(n-2); } What is f(${n+5})?`,(()=>{let a=0,b=1;for(let i=0;i<n+5;i++) [a,b]=[b,a+b];return a;})(),[2**n,(n+5)**2,n+5]),
      () => ({q:'JavaScript: console.log("A"); Promise.resolve().then(() => console.log("B")); queueMicrotask(() => console.log("C")); console.log("D"); What is the output order?',a:'A D B C',choices:['A D B C','A B C D','A D C B','A B D C']}),
      () => ({q:'A recurrence is T(n) = 2T(n/2) + n log₂n, with T(1) = 1. What is its tight asymptotic bound?',a:'Θ(n (log n)²)',choices:['Θ(n (log n)²)','Θ(n log n)','Θ(n²)','Θ(log n)']})
    ];
    result = pick(questions)();
  } else if (subject === 'Geography') {
    const questions = level === 4 ? [
      () => numeric(`A map uses scale 1:50,000. Two places are ${n} cm apart on the map. What is their distance in kilometres?`,n/2,[n*5,n/5,n*50]),
      () => numeric(`A place is at ${15*n}° east longitude. Using ideal solar time, how many hours ahead of Greenwich is it?`,n,[n/15,15*n,-n])
    ] : level === 5 ? [
      () => numeric(`A river drops ${n*20} metres over 10 kilometres. What is its average gradient in metres per kilometre?`,2*n,[20*n,n/2,200*n]),
      () => numeric(`A region has ${n*100000} people and an area of ${m*1000} km². What is its density in people/km²?`,100*n/m,[n*m,100*m/n,n/m])
    ] : level === 6 ? [
      () => numeric(`At sea level the temperature is 24°C. Assume it falls 6°C per kilometre of elevation. What is the temperature at ${n} km?`,24-6*n,[24+6*n,24-n,6*n]),
      () => numeric(`A basin receives ${n*100} mm of rain; evapotranspiration is ${m*20} mm; storage increases by 40 mm. Assuming no other flows, what is runoff in mm?`,n*100-m*20-40,[n*100-m*20+40,n*100+m*20-40,n*100-40])
    ] : level === 7 ? [
      () => numeric(`A population starts at ${n*10000}. It increases 10% in each of two successive years. What is the final population?`,n*12100,[n*12000,n*11000,n*10000]),
      () => numeric(`On a 1:25,000 map, a square measures ${n} cm on each side. What real area does it represent in km²?`,n*n/16,[n*n/4,n/4,n*n])
    ] : [
      () => numeric(`Air begins at sea level at 30°C, rises to 2 km (dry cooling: 10°C/km), then to 4 km (saturated cooling: 6°C/km). It descends to sea level warming at 10°C/km. What is its final temperature?`,38,[30,22,46]),
      () => numeric(`A watershed has area 10 km². A storm delivers ${n*10} mm of rain and 40% becomes runoff. What runoff volume is produced in m³?`,n*40000,[n*4000,n*400000,n*100000]),
      () => numeric(`A river has width ${n} m, mean depth ${m} m and mean velocity ${k} m/s. If width doubles and depth halves while velocity triples, what is its new discharge in m³/s?`,3*n*m*k,[n*m*k,6*n*m*k,1.5*n*m*k])
    ];
    result = pick(questions)();
  } else {
    const banks = {
      English: [
        [ ['Which sentence uses the subjunctive correctly?', 'If I were you, I would wait.', 'If I was you, I will wait.', 'If I am you, I would wait.', 'If I be you, I waited.'], ['Which sentence has a dangling modifier?', 'Walking to school, the rain soaked Maya.', 'Walking to school, Maya got soaked.', 'The rain soaked Maya on her walk.', 'Maya walked to school in the rain.'] ],
        [ ['Which revision removes the ambiguity in “I saw the man with the telescope” if the telescope was used for seeing?', 'Using a telescope, I saw the man.', 'I saw the man who had a telescope.', 'The man with a telescope was seen by me.', 'I saw the telescope with the man.'], ['“The classroom was a zoo.” Which device is used?', 'Metaphor', 'Simile', 'Literal description', 'Onomatopoeia'] ],
        [ ['Which sentence has correct subject–verb agreement?', 'Neither the teachers nor the principal is available.', 'Neither the teachers nor the principal are available.', 'The list of names are missing.', 'Each of the students have arrived.'], ['Which statement is a paradox?', 'The more I learn, the more I realize how little I know.', 'The wind whispered softly.', 'Her smile was sunshine.', 'He ran as fast as a cheetah.'] ],
        [ ['“Only after the doors closed did she speak.” Why is “did she” inverted?', 'A fronted restrictive adverbial triggers inversion.', 'Every past-tense sentence requires inversion.', 'The sentence is a direct question.', 'The subject is plural.'], ['A narrator insists they are honest, but the events contradict their account. What is the best-supported interpretation?', 'The narrator may be unreliable.', 'The author made a grammatical error.', 'The story has no narrator.', 'Every event must be fictional within the story.'] ],
        [ ['“Had the evidence been disclosed, the verdict might have differed.” Which paraphrase preserves both time and uncertainty?', 'If the evidence had been disclosed, the verdict might have been different.', 'If evidence is disclosed, the verdict will differ.', 'The evidence was disclosed, so the verdict differed.', 'If the evidence had been disclosed, the verdict certainly would have differed.'], ['In “Every student read a book”, what are the two possible scope readings?', 'One shared book, or potentially different books for different students.', 'No student read, or every student wrote.', 'Every book was read, or no book was read.', 'Exactly one student read, or two students read.'], ['“The policy reduces costs; therefore, it must improve overall welfare.” Which unstated assumption is needed?', 'The cost savings outweigh any harms relevant to welfare.', 'Every policy reduces costs.', 'Welfare is unrelated to costs.', 'The policy was enacted yesterday.'], ['“She is poor but honest.” Compared with “and”, what does “but” conventionally convey?', 'A contrast between the two descriptions.', 'A causal link from poverty to honesty.', 'That one description is false.', 'That honesty occurred before poverty.'] ]
      ],
      History: [
        [ ['A diary was written during an event by a participant. How is it usually classified?', 'Primary source', 'Secondary source', 'An archaeological replica', 'A modern textbook'], ['Which change most directly distinguishes industrial production from cottage production?', 'Mechanization and concentration of work in factories.', 'All trade ceases.', 'Money is abolished.', 'Every worker becomes a farmer.'] ],
        [ ['Why can a contemporary eyewitness account still be unreliable?', 'Perspective, bias and limited knowledge can affect it.', 'All primary sources are false.', 'Only later sources can contain facts.', 'Eyewitnesses cannot write documents.'], ['A historian compares tax records with letters describing poverty. What is the main benefit?', 'Corroborating claims using independent types of evidence.', 'Proving every letter is accurate.', 'Eliminating the need to consider context.', 'Making the tax records into secondary sources.'] ],
        [ ['A ruler’s proclamation praises their own victory. What should a historian examine first when assessing its claims?', 'Purpose, intended audience and independent evidence.', 'Whether it uses long words.', 'Whether it agrees with modern preferences.', 'Whether all victorious rulers were truthful.'], ['Which claim best distinguishes an immediate trigger from an underlying cause?', 'An assassination can trigger conflict amid long-standing rivalries.', 'The trigger always occurs decades earlier.', 'Underlying causes are always single events.', 'A trigger proves there were no other causes.'] ],
        [ ['Two independent contemporary sources disagree about an army’s size. What is the strongest approach?', 'Compare methods, access, motives and further evidence.', 'Automatically average their numbers.', 'Choose the larger number.', 'Discard all contemporary evidence.'], ['What is presentism in historical interpretation?', 'Judging the past only through present-day assumptions without its context.', 'Using evidence created during an event.', 'Comparing several historical periods.', 'Studying material remains.'] ],
        [ ['A law forbids a practice, but later court records repeatedly prosecute it. What can be inferred most securely?', 'The practice persisted despite the legal prohibition.', 'The law immediately ended the practice.', 'Everyone engaged in the practice.', 'The prosecutions prove the law did not exist.'], ['Surviving records mostly come from wealthy landowners. What is the strongest limitation on a claim about the whole population?', 'The surviving sample may underrepresent other social groups.', 'Landowners never recorded accurate facts.', 'No historical inference is possible.', 'The sample must be representative because it survived.'], ['After a reform, output increases, but a new technology also appears. What prevents a secure claim that the reform caused all the increase?', 'A competing causal explanation has not been ruled out.', 'Events can never have causes.', 'Output cannot be measured.', 'The reform must have reduced output.'], ['A later author repeats an earlier chronicle nearly word for word. Why are they weak as two independent confirmations?', 'The later account may depend on the earlier one.', 'Later authors cannot be historians.', 'Similar wording guarantees both are false.', 'Chronicles cannot discuss events.'] ]
      ]
    };
    const [q,a,...wrong] = pick(banks[subject][level-4]);
    result = {q,a,choices:[a,...wrong]};
  }
  // Fisher–Yates keeps answer positions unbiased.
  for (let i=result.choices.length-1;i>0;i--) {
    const j=integer(0,i);
    [result.choices[i],result.choices[j]]=[result.choices[j],result.choices[i]];
  }
  return result;
}
