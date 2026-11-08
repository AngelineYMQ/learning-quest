'use strict';
(function(){
 const round=n=>Math.round(n*100)/100;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const events=[{title:'A quiet day',factor:.7,cost:0},{title:'A normal day',factor:1,cost:0},{title:'A local event brings more visitors',factor:1.3,cost:0},{title:'A small equipment repair',factor:.9,cost:45},{title:'Happy customers recommend you',factor:1.15,cost:0}];
 function init(config){const cost=config.kind==='cafe'?3:config.kind==='retail'?5:4;return {version:1,day:0,cash:round(config.capital-config.setup),stock:Math.floor(config.stockBudget/cost),unitCost:cost,price:cost*3,capacity:15,marketing:0,quality:'standard',reputation:60,debt:config.loan?config.capital:0,loanPayment:config.loan?Math.ceil(config.capital/12):0,rent:config.rent,openingSetup:config.setup,openingDeposit:config.deposit,openingInventory:config.stockBudget,operatingProfit:0,revenue:0,history:[],last:null}}
 function play(s,decision,eventIndex){
 if(s.day>=30)return {error:'Your 30-day season is complete. Review your results.'};
 const price=Number(decision.price),units=Number(decision.units),ads=Number(decision.ads),quality=decision.quality;
 if(!Number.isFinite(price)||price<s.unitCost||price>100||!Number.isInteger(units)||units<0||units>60||![0,10,25].includes(ads)||!['standard','careful'].includes(quality))return {error:'Use a price between unit cost and $100, 0–60 new units, and the available choices.'};
 const qualityCost=quality==='careful'?8:0,overhead=12,event=events[clamp(eventIndex,0,events.length-1)],upfront=round(units*s.unitCost+ads+qualityCost+overhead);
 if(s.cash<upfront)return {error:'Not enough cash for today’s plan. Lower preparation or marketing. You can sell stock you already own.'};
 const next={...s,history:[...s.history]},day=s.day+1;
 const expected=22*(s.unitCost*3/price)*(.65+s.reputation/150)*(1+ads/60)*event.factor;
 const demand=clamp(Math.floor(expected),0,70),available=s.stock+units,sold=Math.min(available,demand,40),revenue=round(sold*price),cogs=round(sold*s.unitCost),rentExpense=round(s.rent/30);
 const operating=round(revenue-cogs-ads-qualityCost-overhead-event.cost-rentExpense);
 // The first month's rent was paid during setup. Rent accrues in profit each day,
 // but is not paid a second time in this 30-day season.
 const beforeDebt=round(s.cash-upfront+revenue-event.cost),due=day===30?Math.min(s.debt,s.loanPayment):0,repayment=Math.min(Math.max(0,beforeDebt),due),unpaid=round(due-repayment);
 next.day=day;next.cash=round(beforeDebt-repayment);next.stock=available-sold;next.price=price;next.capacity=units;next.marketing=ads;next.quality=quality;next.debt=round(s.debt-repayment);
 next.reputation=clamp(s.reputation+(quality==='careful'?4:1)-(sold<Math.min(demand,40)?3:0)-(price>s.unitCost*5?3:0),0,100);
 next.operatingProfit=round(s.operatingProfit+operating);next.revenue=round(s.revenue+revenue);
 next.last={day,event:event.title,demand,sold,revenue,cogs,purchases:round(units*s.unitCost),ads,qualityCost,overhead,repair:event.cost,rentExpense,profit:operating,cashChange:round(next.cash-s.cash),cash:next.cash,stock:next.stock,repayment,unpaid};
 next.history.push(next.last);return {state:next};
 }
 window.CompanyRunEngine={init,play,events};
 window.openCompanyOperations=function(context){
 window.learningNavigate?.('/business/run');
 const {game,b,place,setup,deposit,commit,onback}=context,root=document.getElementById('courseContent');
 if(!game.operations){game.operations=init({kind:game.kind,capital:game.cash,setup,stockBudget:b.stock,rent:place[1],deposit,loan:game.fundingSource==='loan'});commit()}
 const money=n=>'$'+Number(n).toLocaleString('en-SG',{minimumFractionDigits:2,maximumFractionDigits:2});
 function el(tag,text){const n=document.createElement(tag);if(text)n.textContent=text;return n}
 function button(text,fn){const n=el('button',text);n.onclick=fn;return n}
 function draw(){const s=game.operations;root.replaceChildren(button('← Company setup',onback),el('h2','🏪 Run '+game.name),el('p','A 30-day pretend business season. Every day has decisions, customers, costs and results. Your industry uses a simplified product/service unit model; these are game assumptions, not a business forecast.'));
 const stats=el('div');stats.className='profile-stats';[['Day',s.day+'/30'],['Cash available',money(s.cash)],['Operating profit so far',money(s.operatingProfit)],['Stock / service resources',s.stock],['Customer happiness',s.reputation+'/100'],['Family loan still owed',money(s.debt)]].forEach(([label,value])=>{const card=el('div');card.append(el('span',label),el('strong',String(value)));stats.append(card)});root.append(stats);
 root.append(el('p','Opening setup used '+money(s.openingSetup)+', including '+money(s.openingDeposit)+' deposit held and '+money(s.openingInventory)+' supplies. Operating profit excludes the original equipment/setup costs, tax and owner pay; it is not total company profit. First-month space cost is already paid; daily accounts still include rent of '+money(round(s.rent/30))+'.'));
 if(s.loanPayment)root.append(el('p','Family-loan mission: '+money(s.loanPayment)+' is due on day 30 (pretend interest-free terms). Paying back principal reduces cash and debt, not operating profit.'));
 if(s.day<30){
 root.append(el('h3','Plan day '+(s.day+1)));
 const fields={};
 function input(key,label,value,min,max,step){const l=el('label',label),n=el('input');n.type='number';n.min=min;n.max=max;n.step=step;n.value=value;l.append(n);fields[key]=n;root.append(l)}
 input('price','Price per product / service unit ($)',s.price,s.unitCost,100,.5);input('units','New units / service resources to prepare (0–60)',s.capacity,0,60,1);
 [['ads','Today’s marketing budget',[[0,'No ads · $0'],[10,'Small local promotion · $10'],[25,'Bigger promotion · $25']],s.marketing],['quality','Customer-care choice',[['standard','Standard care · $0 extra'],['careful','Extra quality checks and care · $8']],s.quality]].forEach(([key,label,options,value])=>{const l=el('label',label),n=el('select');options.forEach(([v,t])=>{const o=el('option',t);o.value=v;n.append(o)});n.value=value;fields[key]=n;l.append(n);root.append(l)});
 root.append(el('p','Each prepared unit costs '+money(s.unitCost)+'. Unsold resources remain for later days in this simplified game; real food can spoil. Daily overhead is $12. More marketing cannot guarantee sales. Capacity is at most 40 sales/day.'));
 const status=el('p');status.setAttribute('role','status');root.append(status,button('🌞 Open for today — see what happens',()=>{const result=play(game.operations,{price:fields.price.value,units:fields.units.value,ads:fields.ads.value,quality:fields.quality.value},Math.floor(Math.random()*events.length));if(result.error){status.textContent=result.error;return}game.operations=result.state;commit();draw()}));
 }else root.append(el('h3','🎉 Your first business month is complete!'),el('p',s.operatingProfit>0?'Your daily trading made an operating surplus. Can it also cover setup costs, tax, owner pay and future bills?':'Your daily trading made an operating loss. Look at price, unused stock, promotion and overhead before planning another business.'));
 if(s.last){const r=s.last;root.append(el('h3','Day '+r.day+' diary: '+r.event),el('p',r.demand+' interested customers · '+r.sold+' sales · '+r.stock+' resources left.'));
 const table=el('table');[['Sales revenue',r.revenue],['Resources used in sales',-r.cogs],['Marketing',-r.ads],['Extra customer care',-r.qualityCost],['Daily overhead',-r.overhead],['Repair event',-r.repair],['Rent allocated to this day',-r.rentExpense],['Today’s operating profit / loss',r.profit],['Cash spent on new resources',-r.purchases],['Loan principal repaid',-r.repayment],['Actual cash change today',r.cashChange]].forEach(([name,value])=>{const tr=el('tr');tr.append(el('td',name),el('td',money(value)));table.append(tr)});root.append(table,el('p',r.profit>=0?'🦊 Pip: You earned more from sales than today’s operating costs. Check your cash too: stock purchases and loan repayments affect it differently.':'🦊 Pip: Today cost more than it earned. Try one change tomorrow: a sensible price, less unused stock, or a smaller promotion.'));
 if(r.unpaid>0)root.append(el('p','⚠️ '+money(r.unpaid)+' of today’s loan repayment could not be paid. It remains owed. Talk through a recovery plan with a grown-up.'));
 if(s.cash<0)root.append(el('p','⚠️ Cash is below zero after an unexpected cost. Pause and review; this is not a new loan or free money.'))}
 if(s.history.length){const chart=el('div');chart.className='profile-block';chart.append(el('h3','Your business record'));const table=el('table');const head=el('tr');['Day','Sales','Operating result','Cash left'].forEach(t=>head.append(el('th',t)));table.append(head);s.history.forEach(r=>{const tr=el('tr');[r.day,money(r.revenue),money(r.profit),money(r.cash)].forEach(t=>tr.append(el('td',String(t))));table.append(tr)});chart.append(table);root.append(chart)}
 root.append(button('📖 Learn about profit and cash flow',()=>document.getElementById('coursesNav').click()));
 }
 draw();
 };
})();