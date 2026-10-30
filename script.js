(()=>{
const $=(s,r=document)=>r.querySelector(s),
$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ls=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));
    localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
let goHook=null;
const go=(plan,prog,msg)=>{goHook&&goHook(plan,prog,msg)};
const mo=h=>{$('#mbox').innerHTML='<button class="x" aria-label="Close">×</button>'+h;$('#modal').classList.add('open')};
$('#modal').onclick=e=>{if(e.target.id==='modal'||e.target.classList.contains('x'))$('#modal').classList.remove('open')};
addEventListener('keydown',e=>{if(e.key==='Escape')$('#modal').classList.remove('open')});

// preloader ends when page is loaded
addEventListener('load',()=>setTimeout(()=>{$('.preloader').style.animation='preloaderOut .5s forwards';$('.site').style.animation='siteIn .6s forwards'},1200));
// Live opening status in Ludhiana time (Mon-Sat 5 AM-11 PM; Sun 7 AM-1 PM).
const updateOpenStatus=()=>{
  const target=$('#open-status');if(!target)return;
  const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
  const hours=[[7,13],[5,23],[5,23],[5,23],[5,23],[5,23],[5,23]];
  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const day=now.getDay(),hour=now.getHours()+now.getMinutes()/60,[opens,closes]=hours[day];
  const fmt=h=>(h%12||12)+(h<12||h===24?' AM':' PM');
  let open=hour>=opens&&hour<closes,text;
  if(open)text='Open now · closes '+fmt(closes);
  else if(hour<opens)text='Closed · opens today at '+fmt(opens);
  else{const next=(day+1)%7;text='Closed · opens '+days[next]+' at '+fmt(hours[next][0]);}
  target.classList.toggle('closed',!open);
  target.innerHTML='<i aria-hidden="true"></i>'+text;
};
updateOpenStatus();
setInterval(updateOpenStatus,60000);

// mobile nav, sticky header, back-to-top, active link
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{$('#nav-toggle').checked=false}));
const hd=$('header.nav'),secs=$$('section[id]'),nl=$$('.nav-links a[href^="#"]:not(.btn)');
const onS=()=>{hd.classList.toggle('sm',scrollY>40);$('#totop').classList.toggle('show',scrollY>600);let cur='';secs.forEach(s=>{if(s.offsetTop-140<=scrollY)cur=s.id});nl.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur))};
addEventListener('scroll',onS,{passive:true});onS();
$('#totop').onclick=()=>scrollTo({top:0,behavior:'smooth'});

// dark / light theme
const tb=$('#theme'),setT=d=>{document.body.classList.toggle('dark',d);tb.textContent=d?'☀':'☾';ls('forgeDark',d)};
setT(!!ls('forgeDark'));tb.onclick=()=>setT(!document.body.classList.contains('dark'));

// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);setTimeout(()=>e.target.classList.remove('rv','in'),700)}}),{threshold:.12});
$$('.program-card,.trainer-card,.plan-card,.section-head,.card2,.tile').forEach(e=>{e.classList.add('rv');io.observe(e)});

// plans: yearly toggle + plan buttons
const plans=$$('.plan-card'),names=['Starter','Performance','Elite'];
const base=plans.map(c=>+$('.plan-price',c).firstChild.nodeValue.replace(/\D/g,''));
let yearly=false;
$('#billtog').onclick=function(){yearly=!yearly;this.setAttribute('aria-pressed',yearly);plans.forEach((c,i)=>{const p=$('.plan-price',c);p.firstChild.nodeValue=inr(yearly?base[i]*10/12:base[i]);$('sub',p).textContent=yearly?'/mo, billed yearly':'/mo'})};
plans.forEach((c,i)=>$('a.btn',c).addEventListener('click',e=>{e.preventDefault();go(names[i])}));

// BMI + calories
$('#bmif').onsubmit=e=>{e.preventDefault();const h=+$('#bh').value,w=+$('#bw').value,a=+$('#ba').value,r=$('#bres');r.hidden=false;
if(!(h>100&&h<250&&w>25&&w<300&&a>10&&a<100)){r.textContent='Please enter realistic values: height 100–250 cm, weight 25–300 kg, age 10–100.';return}
const b=w/((h/100)**2),c=b<18.5?['Underweight','Strength & Power','build size with a calorie surplus']:b<25?['Healthy range','Strength & Power or Boxing Fitness','keep building strength and fitness']:b<30?['Overweight','Conditioning + Boxing Fitness','combine cardio with strength work']:['Obese range','Conditioning + Mobility & Recovery','start low-impact and progress gradually'];
const t=(10*w+6.25*h-5*a+($('#bs').value==='m'?5:-161))*+$('#bact').value;
r.innerHTML=`<b>BMI ${b.toFixed(1)}: ${c[0]}</b><br>Suggested: <b>${c[1]}</b>, ${c[2]}. <a href="#" data-auth="signup"><b>Sign up for a trial →</b></a><br><small>General guide only, not medical advice.</small>`};

// calorie & macro calculator
let tgt=0;
$('#kf').onsubmit=e=>{e.preventDefault();const a=+$('#ka').value,hh=+$('#kh').value,w=+$('#kw').value,r=$('#kres'),m=$('#ks').value==='m';r.hidden=false;
if(!(hh>100&&hh<250&&w>25&&w<300&&a>10&&a<100)){r.textContent='Please enter realistic values: height 100–250 cm, weight 25–300 kg, age 10–100.';return}
const bmr=10*w+6.25*hh-5*a+(m?5:-161),tdee=bmr*+$('#kact').value,g=+$('#kg').value;tgt=Math.max(Math.round(tdee+g),m?1500:1200);
const p=Math.round(w*(g<0?2:1.8)),fat=Math.round(tgt*.25/9),carb=Math.max(0,Math.round((tgt-p*4-fat*9)/4));
r.innerHTML=`<b>Daily target: ${tgt} kcal</b><br>Maintenance: ${Math.round(tdee)} kcal · BMR: ${Math.round(bmr)} kcal<br>Protein <b>${p} g</b> · Carbs <b>${carb} g</b> · Fat <b>${fat} g</b><br><small>General guide only, not medical advice. Check food totals below against this target.</small>`;showMeal()};

// food calorie checker [name, serving, kcal, protein g]
const FD=[['Roti / chapati','1 medium',100,3],['Plain paratha','1 medium',200,4],['Aloo paratha','1 medium',290,6],['White rice (cooked)','1 cup',200,4],['Dal','1 bowl',150,8],['Rajma','1 bowl',210,10],['Chole','1 bowl',250,11],['Paneer','100 g',265,18],['Paneer bhurji','1 bowl',300,15],['Chicken breast (cooked)','100 g',165,31],['Chicken curry','1 bowl',240,20],['Fish curry','1 bowl',200,20],['Egg (boiled)','1 egg',78,6],['Omelette','2 eggs',190,13],['Curd / dahi','1 bowl',100,6],['Milk','1 glass (250 ml)',150,8],['Idli','1 piece',58,2],['Plain dosa','1 piece',120,3],['Masala dosa','1 piece',250,5],['Poha','1 plate',250,5],['Upma','1 plate',230,5],['Oats (cooked)','1 bowl',150,5],['Veg biryani','1 plate',380,9],['Chicken biryani','1 plate',450,22],['Samosa','1 piece',260,4],['Bread slice','1 slice',80,3],['Peanut butter','1 tbsp',95,4],['Peanuts','30 g',170,7],['Almonds','10 pieces',70,3],['Whey protein','1 scoop',120,24],['Banana','1 medium',105,1],['Apple','1 medium',95,0],['Mango','1 cup',100,1],['Sprouts salad','1 bowl',100,7],['Sweet potato','100 g',86,2],['Pizza slice','1 slice',285,12],['Burger','1 regular',300,15],['French fries','1 medium',365,4],['Gulab jamun','1 piece',150,2],['Chai with sugar','1 cup',80,2],['Cola','330 ml',140,0]];
let meal=JSON.parse(JSON.stringify(ls('forgeMeal')||[]));
const showFood=()=>{const q=$('#fq').value.trim().toLowerCase();$('#fres').innerHTML=FD.map((f,i)=>({f,i})).filter(o=>!q||o.f[0].toLowerCase().includes(q)).slice(0,q?20:8).map(o=>`<div class="fr"><span>${o.f[0]}<br><small>${o.f[1]} · ${o.f[2]} kcal · ${o.f[3]} g protein</small></span><button type="button" data-a="${o.i}" aria-label="Add ${o.f[0]}">+</button></div>`).join('')||'<p style="font-size:.85rem">No match. Try another word.</p>'};
function showMeal(){const k=meal.reduce((s,m)=>s+FD[m[0]][2]*m[1],0),p=meal.reduce((s,m)=>s+FD[m[0]][3]*m[1],0);
$('#fmeal').innerHTML=meal.map((m,j)=>`<div class="fr"><span>${FD[m[0]][0]}<br><small>${FD[m[0]][1]} × ${m[1]} = ${FD[m[0]][2]*m[1]} kcal</small></span><span><button type="button" data-m="${j}" data-d="-1" aria-label="Less">−</button> <button type="button" data-m="${j}" data-d="1" aria-label="More">+</button></span></div>`).join('');
$('#ftot').innerHTML=meal.length?`<b>${k} kcal</b> · ${p} g protein`+(tgt?`<br>${Math.round(k/tgt*100)}% of your ${tgt} kcal target`:''):'Nothing added yet.';ls('forgeMeal',meal)}
$('#fq').oninput=showFood;
$('#fres').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const i=+b.dataset.a,x=meal.find(m=>m[0]===i);x?x[1]++:meal.push([i,1]);showMeal()};
$('#fmeal').onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=meal[+b.dataset.m];m[1]+=+b.dataset.d;if(m[1]<1)meal.splice(+b.dataset.m,1);showMeal()};
$('#fclr').onclick=()=>{meal=[];showMeal()};showFood();showMeal();

// water intake + daily glass tracker

const wk = 'forgeWater' + new Date().toDateString().replace(/\s/g, '');
const ML = 250;

// Restore previously saved data
const saved = ls(wk);

let goal = saved?.goal ?? 0;
let glasses = saved?.n ?? 0;

// Draw water glasses
const drawW = () => {
    $('#wgl').innerHTML = Array.from(
        { length: goal },
        (_, i) => `
            <button
                type="button"
                class="gl${i < glasses ? ' on' : ''}"
                data-g="${i}"
                aria-label="Glass ${i + 1}">
            </button>
        `
    ).join('');

    $('#wcount').textContent =
        `${glasses} of ${goal} glasses ` +
        `(${(glasses * ML / 1000).toFixed(2)} L)` +
        (glasses >= goal ? ' · Goal reached!' : '');
};

// Restore tracker UI on page refresh
if (goal > 0) {
    $('#wtrk').hidden = false;
    $('#wres').hidden = false;

    $('#wres').innerHTML = `
        <b>${(goal * ML / 1000).toFixed(1)} litres today</b>
        (about ${goal} glasses of 250 ml)
        <br>
        <small>Your saved water intake progress.</small>
    `;

    drawW();
}

// Calculate water goal
$('#wf').onsubmit = e => {
    e.preventDefault();

    const w = +$('#ww').value;
    const mn = +$('#wm').value || 0;
    const r = $('#wres');

    r.hidden = false;

    if (!(w > 25 && w < 300 && mn >= 0 && mn <= 600)) {
        r.textContent =
            'Please enter a realistic weight (25–300 kg) ' +
            'and exercise time (0–600 minutes).';
        return;
    }

    const ml = w * 35 + mn * 12 + +$('#wc').value;
    const newGoal = Math.round(ml / ML);

    // Preserve today's progress
    glasses = Math.min(glasses, newGoal);
    goal = newGoal;

    // Save updated goal and progress
    ls(wk, { goal, n: glasses });

    r.innerHTML = `
        <b>${(ml / 1000).toFixed(1)} litres today</b>
        (about ${goal} glasses of 250 ml)
        <br>
        <small>
            Based on 35 ml per kg, plus extra for exercise and weather.
        </small>
    `;

    $('#wtrk').hidden = false;
    drawW();
};

// Track water glasses
$('#wgl').onclick = e => {
    const b = e.target.closest('[data-g]');
    if (!b) return;

    const i = +b.dataset.g;

    glasses = glasses === i + 1 ? i : i + 1;

    // Save progress immediately
    ls(wk, { goal, n: glasses });

    drawW();
};


// timetable
const S=[['Mon','6:00 AM','Strength & Power','Arjun Kapoor'],['Mon','7:00 PM','Boxing Fitness','Riya Sharma'],['Tue','6:30 AM','Conditioning','Arjun Kapoor'],['Tue','6:00 PM','Mobility & Recovery','Manpreet Virk'],['Wed','6:00 AM','Strength & Power','Arjun Kapoor'],['Wed','7:00 PM','Boxing Fitness','Riya Sharma'],['Thu','6:30 AM','Conditioning','Riya Sharma'],['Thu','6:00 PM','Strength & Power','Arjun Kapoor'],['Fri','6:00 AM','Boxing Fitness','Riya Sharma'],['Fri','7:00 PM','Mobility & Recovery','Manpreet Virk'],['Sat','8:00 AM','Conditioning','Arjun Kapoor'],['Sat','10:00 AM','Boxing Fitness','Riya Sharma'],['Sun','8:00 AM','Mobility & Recovery','Manpreet Virk']];
let fp='All';const esc=s=>s.replace(/&/g,'&amp;');
$('#pf').innerHTML=['All','Strength & Power','Conditioning','Boxing Fitness','Mobility & Recovery'].map(p=>`<button type="button" class="${p==='All'?'on':''}">${esc(p)}</button>`).join('');
const rend=()=>{const d=$('#df').value;$('#ttb').innerHTML=S.map((r,i)=>({r,i})).filter(o=>(fp==='All'||o.r[2]===fp)&&(d==='All'||o.r[0]===d)).map(o=>`<tr><td>${o.r[0]}</td><td>${o.r[1]}</td><td>${esc(o.r[2])}</td><td>${o.r[3]}</td><td><a href="#contact" class="bk" data-i="${o.i}">Book</a></td></tr>`).join('')||'<tr><td colspan="5">No classes match.</td></tr>'};
$('#pf').onclick=e=>{if(e.target.tagName!=='BUTTON')return;fp=e.target.textContent;$$('#pf button').forEach(b=>b.classList.toggle('on',b===e.target));rend()};
$('#df').onchange=rend;rend();
$('#ttb').onclick=e=>{const a=e.target.closest('.bk');if(a){e.preventDefault();go(null,S[a.dataset.i][2])}};

// testimonial slider
const TS=[['Karan Dhillon','Member since 2023',"I've joined three gyms before this one. Forge is the first place a coach actually noticed when my form broke down."],['Simran Kaur','Member since 2024','The Saturday conditioning class rebuilt my stamina. I climb stairs without thinking about it now.'],['Rohit Bansal','Member since 2022','Small groups and honest coaching. I lost 14 kg and kept it off because the plan changed as I did.'],['Neha Arora','Member since 2025','Manpreet got me training again after a knee injury. No rushing, just a clear plan.']];
let ti=0,tt;const dots=$('#tdots');dots.innerHTML=TS.map((_,i)=>`<button data-i="${i}" aria-label="Testimonial ${i+1}" style="padding:4px 9px">•</button>`).join('');
const show=i=>{ti=(i+TS.length)%TS.length;const t=TS[ti];$('#tq').textContent='"'+t[2]+'"';$('#tc').innerHTML=`${t[0]}<span>${t[1]}</span>`;$$('#tdots button').forEach((b,j)=>b.classList.toggle('on',j===ti))};
const auto=()=>{clearInterval(tt);tt=setInterval(()=>show(ti+1),6000)};
$('#tprev').onclick=()=>{show(ti-1);auto()};$('#tnext').onclick=()=>{show(ti+1);auto()};dots.onclick=e=>{if(e.target.dataset.i){show(+e.target.dataset.i);auto()}};show(0);auto();

// FAQ accordion
$$('.faq button').forEach(b=>b.onclick=()=>{const a=b.nextElementSibling,o=b.getAttribute('aria-expanded')==='true';$$('.faq button').forEach(x=>{x.setAttribute('aria-expanded',false);x.nextElementSibling.style.maxHeight=0;x.lastChild.textContent='+'});if(!o){b.setAttribute('aria-expanded',true);a.style.maxHeight=a.scrollHeight+'px';b.lastChild.textContent='−'}});

// enhanced programs
const P=[
{m:'St',n:'Strength & Power',l:'All levels',g:['muscle'],d:'Barbell-based programming for squat, bench and deadlift progress you can track to the kilo.',min:60,wk:'3–4',i:4,t:['Barbell','Powerlifting','Progress tracking'],do:['Mobility warm-up','Main lift with planned sets and reps','Accessory work for weak points','Every number logged'],w:'Anyone who wants to get stronger, from first-time lifters to competitors.',wkp:'Mon squat · Wed bench · Fri deadlift · Sat accessories',e:'Racks, platforms, barbells, plates'},
{m:'Cn',n:'Conditioning',l:'Intermediate',g:['fat','stamina'],d:'Metabolic circuits and sled work built to raise your engine without wrecking your joints.',min:45,wk:'2–3',i:5,t:['Circuits','Sled work','HIIT'],do:['Dynamic warm-up','Timed circuits and intervals','Sled pushes and carries','Cool-down and breathing'],w:'People who want better stamina and fat loss and can handle hard effort.',wkp:'Tue circuits · Thu intervals · Sat engine builder',e:'Sleds, kettlebells, rowers, battle ropes'},
{m:'Bx',n:'Boxing Fitness',l:'All levels',g:['fat','stamina'],d:'Pad work, bag rounds and footwork drills. No sparring required to get the benefits.',min:60,wk:'2–3',i:4,t:['Pad work','Heavy bag','Footwork'],do:['Skipping and shadow boxing','Technique drills','Pad rounds with a coach','Core finisher'],w:'Anyone who wants a high-energy workout that builds coordination and stamina.',wkp:'Mon pads · Wed bag rounds · Fri footwork and conditioning',e:'Bags, pads, gloves, ring space (gloves available)'},
{m:'Rc',n:'Mobility & Recovery',l:'All levels',g:['recovery','beginner'],d:'Guided stretching, breathwork and soft-tissue sessions to keep you training, not sidelined.',min:45,wk:'1–2',i:2,t:['Stretching','Breathwork','Soft tissue'],do:['Guided mobility flow','Foam rolling and soft-tissue work','Breathwork to downshift','Individual injury advice'],w:'Hard trainers, desk workers and anyone coming back from an injury.',wkp:'Tue mobility flow · Sun recovery session',e:'Mats, rollers, bands, recovery room'},
{m:'Bf',n:'Beginner Foundations',l:'Beginner',g:['beginner','muscle'],d:'A 6-week coached start: learn the core movements safely and build a habit that sticks.',min:50,wk:'3',i:2,t:['Technique first','Small groups','6 weeks'],do:['Learn squat, hinge, push and pull','Light loads with coach feedback','Simple weekly progress check','Plan for what comes next'],w:'Complete beginners and people returning after a long break.',wkp:'Mon, Wed and Fri, same time each day',e:'Dumbbells, kettlebells, light barbells'},
{m:'Fl',n:'Fat-Loss Transformation',l:'12 weeks',g:['fat'],d:'Strength, conditioning and nutrition guidance in one structured 12-week plan with check-ins.',min:60,wk:'4',i:4,t:['Nutrition guidance','Weekly weigh-in','Accountability'],do:['4 coached sessions every week','Calorie and protein targets','Weekly check-ins with your coach','Measurements at weeks 0, 6 and 12'],w:'People with a clear fat-loss goal who want structure and accountability.',wkp:'2 strength days · 1 conditioning · 1 boxing',e:'Full floor access'}];

const pg=$('.program-grid');
pg.insertAdjacentHTML('beforebegin','<div class="chips" id="gf" style="margin-bottom:22px">'+[['all','All programs'],['muscle','Build muscle'],['fat','Lose fat'],['stamina','Stamina'],['recovery','Recovery'],['beginner','Beginner']].map((g,i)=>`<button type="button" data-g="${g[0]}" class="${i?'':'on'}">${g[1]}</button>`).join('')+'</div>');
pg.innerHTML=P.map((p,i)=>`<div class="program-card" data-g="${p.g.join(' ')}"><span class="mark">${p.m}</span><h3>${esc(p.n)}</h3><span class="lvl">${p.l}</span><p>${p.d}</p><div class="pmeta"><span>${p.min} min</span><span>${p.wk} days/week</span><span>Intensity <i>${'●'.repeat(p.i)}${'○'.repeat(5-p.i)}</i></span></div><div class="tags">${p.t.map(t=>`<span>${t}</span>`).join('')}</div><div class="pbtn"><button class="btn btn-outline-light btn-small" data-d="${i}">Details</button><button class="btn btn-primary btn-small" data-b="${i}">Book trial</button></div></div>`).join('');
$('#gf').onclick=e=>{const g=e.target.dataset.g;if(!g)return;$$('#gf button').forEach(b=>b.classList.toggle('on',b===e.target));$$('.program-card',pg).forEach(c=>c.style.display=g==='all'||c.dataset.g.split(' ').includes(g)?'':'none')};
pg.onclick=e=>{const d=e.target.closest('[data-d]'),b=e.target.closest('[data-b]');if(b)go(null,P[b.dataset.b].n);if(d){const p=P[d.dataset.d];mo(`<h3>${esc(p.n)}</h3><span class="lvl" style="margin-top:8px">${p.l}</span><p style="margin:8px 0">${p.d}</p><p><b>What you will do</b></p><ul style="list-style:disc;padding-left:20px;margin:6px 0 12px">${p.do.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>Who it is for:</b> ${p.w}</p><p><b>Sample week:</b> ${p.wkp}</p><p><b>Equipment:</b> ${p.e}</p><button class="btn btn-primary btn-small" id="pbk" style="margin-top:16px">Book a free trial</button>`);$('#pbk').onclick=()=>{$('#modal').classList.remove('open');go(null,p.n)}}};

// enhanced coaching staff
const TR={
'Arjun Kapoor':{f:'strength',y:10,cl:'300+',r:'4.9',t:['Powerlifting','Technique','Athlete prep'],q:'Strong lifts are built on boring, repeatable reps.',bio:'Former state-level powerlifter who coaches everyone from first-timers to competitors.',a:['State-level powerlifting medallist','Coached 20+ competition lifters'],c:'Strength & conditioning certified',sl:'Mon–Sat 6–9 AM, 5–8 PM'},
'Riya Sharma':{f:'boxing',y:7,cl:'250+',r:'4.8',t:['Pad work','HIIT','Fat loss'],q:'If you can still talk, hit the pads harder.',bio:'Ex-amateur boxer who runs our pad work and metabolic conditioning classes.',a:['Amateur boxing competitor','Built the Forge conditioning curriculum'],c:'Certified boxing & conditioning coach',sl:'Mon–Sat 7–10 AM, 6–8 PM'},
'Manpreet Virk':{f:'recovery',y:8,cl:'400+',r:'4.9',t:['Rehab','Mobility','Breathwork'],q:'Train through injuries, not around them.',bio:'Physiotherapist who keeps members training safely and gets injured members back on the floor.',a:['Ran 100+ rehab-to-training plans','Designed the Forge recovery room'],c:'Physiotherapist (BPT)',sl:'Tue–Sun 10 AM–1 PM, 4–7 PM'}};
const NEWC=[{n:'Simran Gill',ini:'SG',role:'Nutrition & Wellness Coach',d:'Registered dietitian who turns your training goal into meals you can actually keep eating.',f:'nutrition',y:6,cl:'350+',r:'4.8',t:['Meal plans','Fat loss','Sports nutrition'],q:'You cannot out-train a plan you cannot follow.',bio:'Builds simple, budget-friendly Indian meal plans around your schedule and goals.',a:['Nutrition lead for the 12-week transformation','500+ meal plans written'],c:'Registered dietitian',sl:'Mon–Sat 11 AM–2 PM'},
{n:'Karanveer Singh',ini:'KS',role:'Olympic Lifting & Athletics',d:'Teaches the snatch and clean and jerk, plus speed and jump work for athletes.',f:'strength',y:9,cl:'200+',r:'4.9',t:['Olympic lifts','Speed','Jumps'],q:'Fast is a skill. Practise it.',bio:'Former national-level athlete who prepares students and club players for their seasons.',a:['National-level athletics background','Prepared 30+ athletes for trials'],c:'Weightlifting & athletics coach',sl:'Mon–Fri 6–9 AM, 4–7 PM'},
{n:'Anjali Mehta',ini:'AM',role:'Group Fitness & Women’s Strength',d:'Leads our small-group strength classes and the women’s strength programme.',f:'boxing',y:5,cl:'280+',r:'4.8',t:['Group classes','Women’s strength','Fat loss'],q:'Strong is the goal. The mirror follows.',bio:'Makes the gym floor welcoming for first-timers and builds confidence under the bar.',a:['Launched the women’s strength programme','Coached 150+ beginners'],c:'Group fitness instructor',sl:'Mon–Sat 8–11 AM, 5–8 PM'}];
const grid=$('.trainer-grid');
NEWC.forEach((n,i)=>{TR[n.n]=n;grid.insertAdjacentHTML('beforeend',`<div class="trainer-card"><div class="trainer-photo t${[3,1,2][i]}">${n.ini}</div><div class="trainer-body"><h3>${n.n}</h3><div class="role">${n.role}</div><p>${n.d}</p></div></div>`)});
grid.insertAdjacentHTML('beforebegin','<div class="chips" id="cf" style="margin-bottom:22px">'+[['all','All coaches'],['strength','Strength'],['boxing','Boxing & Group'],['recovery','Recovery'],['nutrition','Nutrition']].map((g,i)=>`<button type="button" data-g="${g[0]}" class="${i?'':'on'}">${g[1]}</button>`).join('')+'</div>');
$('#cf').onclick=e=>{const g=e.target.dataset.g;if(!g)return;$$('#cf button').forEach(b=>b.classList.toggle('on',b===e.target));$$('.trainer-card',grid).forEach(c=>c.style.display=g==='all'||c.dataset.f===g?'':'none')};
$$('.trainer-card',grid).forEach(c=>{const n=$('h3',c).textContent.trim(),t=TR[n];if(!t)return;c.dataset.f=t.f;c.tabIndex=0;
$('.trainer-photo',c).insertAdjacentHTML('afterbegin',`<span class="yrs">${t.y} YRS</span>`);
$('.trainer-body',c).insertAdjacentHTML('beforeend',`<div class="tags">${t.t.map(x=>`<span>${x}</span>`).join('')}</div><div class="tstats"><div><b>${t.y}</b>Years</div><div><b>${t.cl}</b>Clients</div><div><b>${t.r}★</b>Rating</div></div><p class="tq">“${t.q}”</p><button class="btn btn-primary btn-small btn-block">Book a session</button>`);
$('button',c).onclick=e=>{e.stopPropagation();go(null,null,'I would like a session with '+n+'.')};
const open=()=>{const im=$('img',c),ph=$('.trainer-photo',c);
mo(`${im?`<img src="${im.src}" alt="${n}" style="width:100%;height:220px;object-fit:cover;border-radius:4px;margin-bottom:14px">`:`<div class="${ph.className}" style="height:140px;margin-bottom:14px">${ph.lastChild.textContent}</div>`}<h3>${n}</h3><p style="color:var(--ember);font-weight:600">${$('.role',c).textContent}</p><p style="margin:6px 0"><b>${t.r}★</b> · ${t.cl} clients · ${t.y} years</p><p>${t.bio}</p><ul style="list-style:disc;padding-left:20px;margin:10px 0">${t.a.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>Certification:</b> ${t.c}</p><p><b>Specialties:</b> ${t.t.join(', ')}</p><p><b>Available:</b> ${t.sl}</p><button class="btn btn-primary btn-small" id="tbook" style="margin-top:16px">Book a session with ${n.split(' ')[0]}</button>`);
$('#tbook').onclick=()=>{$('#modal').classList.remove('open');go(null,null,'I would like a session with '+n+'.')}};c.onclick=open;c.onkeydown=e=>{if(e.key==='Enter'&&e.target===c)open()}});

// ===== AUTH (login / signup with email verification) =====
// Demo only: no server, so accounts live in this browser's localStorage.
const EMAIL_RE=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const COMMON=['gmail.com','yahoo.com','yahoo.in','outlook.com','hotmail.com','icloud.com','rediffmail.com','live.com','proton.me','protonmail.com'];
const lev=(a,b)=>{const m=[];for(let i=0;i<=a.length;i++)m[i]=[i];for(let j=1;j<=b.length;j++)m[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]};
const hx=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
// returns {ok, msg, suggest}
const checkEmail=v=>{v=v.trim().toLowerCase();
if(!v)return{ok:false,msg:'Please enter your email address.'};
if(/\s/.test(v))return{ok:false,msg:'Email cannot contain spaces.'};
if(!v.includes('@'))return{ok:false,msg:'Email must contain an @ symbol.'};
if(v.split('@').length>2)return{ok:false,msg:'Email can only contain one @ symbol.'};
const [l,d]=v.split('@');
if(!l)return{ok:false,msg:'Enter the part before @ (e.g. name@gmail.com).'};
if(!d)return{ok:false,msg:'Enter the domain after @ (e.g. gmail.com).'};
if(!d.includes('.'))return{ok:false,msg:'Domain looks incomplete. Did you forget ".com"?'};
if(l.startsWith('.')||l.endsWith('.')||l.includes('..')||d.includes('..'))return{ok:false,msg:'Email has misplaced dots.'};
if(!EMAIL_RE.test(v))return{ok:false,msg:'Enter a valid email address, like name@example.com.'};
if(!COMMON.includes(d)){const c=COMMON.find(x=>lev(d,x)<=2);if(c)return{ok:false,msg:'Did you mean ',suggest:l+'@'+c}}
return{ok:true}};
const sha=async t=>{try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(t)))}};
const users=()=>ls('forgeUsers')||{};
const me=()=>{const e=ls('forgeSession');return e&&users()[e]?{email:e,...users()[e]}:null};
const closeM=()=>$('#modal').classList.remove('open');
// Name checker: returns {ok,msg,name} (name = cleaned, capitalised)
const FAKE=['test','testing','admin','user','abc','abcd','asdf','asdfgh','qwerty','xyz','name','fullname','firstname','lastname','null','none','nobody','unknown','demo','sample','fake','aaa'];
const checkName=v=>{v=v.replace(/\s+/g,' ').trim();
if(!v)return{ok:false,msg:'Please enter your full name.'};
if(/\d/.test(v))return{ok:false,msg:'Name cannot contain numbers.'};
if(!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(v))return{ok:false,msg:'Use letters only (no symbols like @, #, _ or emojis).'};
if(/[.'’-]{2,}/.test(v))return{ok:false,msg:'Name has repeated punctuation.'};
const w=v.split(' ');
if(w.length<2)return{ok:false,msg:'Please enter your first and last name.'};
if(w.length>5||v.length>50)return{ok:false,msg:'That name is too long. Max 5 words / 50 characters.'};
const L=x=>x.replace(/[^\p{L}]/gu,'');
if(w.some(x=>L(x).length<2))return{ok:false,msg:'Each part of your name needs at least 2 letters.'};
if(w.some(x=>/(\p{L})\1{2,}/iu.test(x)))return{ok:false,msg:'That does not look like a real name (repeated letters).'};
if(w.some(x=>L(x).length>=4&&!/[aeiouyAEIOUYऀ-ॿ਀-੿]/.test(x)&&/^[a-z]+$/i.test(L(x))))return{ok:false,msg:'That does not look like a real name. Please check the spelling.'};
if(w.some(x=>FAKE.includes(L(x).toLowerCase())))return{ok:false,msg:'Please enter your real name, not a placeholder.'};
const cap=x=>x.split(/(['’-])/).map(p=>/^['’-]$/.test(p)?p:p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join('');
return{ok:true,name:w.map(cap).join(' ')}};
const fieldName=()=>{const i=$('#sn'),r=checkName(i.value);
if(!r.ok){i.classList.remove('ok');setErr('sn',hx(r.msg));return false}
i.value=r.name;i.classList.add('ok');setErr('sn','');return true};
const setErr=(id,html)=>{const i=$('#'+id),e=$('#e-'+id);if(i)i.classList.toggle('bad',!!html);if(e)e.innerHTML=html||''};
const fieldEmail=id=>{const r=checkEmail($('#'+id).value);const i=$('#'+id);
if(r.ok){setErr(id,'');i.classList.add('ok');return true}
i.classList.remove('ok');
setErr(id,r.suggest?`${r.msg}<button type="button" class="sug" data-fix="${hx(r.suggest)}" data-for="${id}">${hx(r.suggest)}</button>?`:hx(r.msg));return false};
const eye=id=>`<div class="pw"><input id="${id}" type="password" autocomplete="${id==='lpw'?'current-password':'new-password'}"><button type="button" data-eye="${id}">Show</button></div>`;
const wireCommon=()=>{const b=$('#mbox');
b.onclick=e=>{const f=e.target.closest('[data-fix]');if(f){$('#'+f.dataset.for).value=f.dataset.fix;fieldEmail(f.dataset.for);return}
const y=e.target.closest('[data-eye]');if(y){const i=$('#'+y.dataset.eye);i.type=i.type==='password'?'text':'password';y.textContent=i.type==='password'?'Show':'Hide';return}
const sw=e.target.closest('[data-switch]');if(sw){e.preventDefault();sw.dataset.switch==='login'?openLogin():openSignup()}
if(e.target.classList.contains('x'))closeM()}};
const openLogin=()=>{
mo(`<div class="auth-box"><h3>Welcome back</h3><p class="sub">Log in to your Forge account.</p>
<form id="lf" class="f" novalidate>
<label for="lem">Email</label><input id="lem" type="email" autocomplete="email" placeholder="you@example.com"><div class="err" id="e-lem"></div>
<label for="lpw">Password</label>${eye('lpw')}<div class="err" id="e-lpw"></div>
<div class="formerr" id="lerr"></div>
<button class="btn btn-primary btn-block" type="submit">Log in</button></form>
<p class="alt">New to Forge? <a href="#" data-switch="signup">Create an account</a></p></div>`);
wireCommon();$('#lem').addEventListener('blur',()=>{if($('#lem').value)fieldEmail('lem')});
$('#lem').addEventListener('input',()=>{$('#lem').classList.remove('ok');setErr('lem','');$('#lerr').textContent=''});
$('#lpw').addEventListener('input',()=>{setErr('lpw','');$('#lerr').textContent=''});
$('#lf').onsubmit=async e=>{e.preventDefault();$('#lerr').textContent='';
const a=fieldEmail('lem'),pw=$('#lpw').value;if(!pw)setErr('lpw','Please enter your password.');if(!a||!pw)return;
const em=$('#lem').value.trim().toLowerCase(),u=users()[em];
if(!u){setErr('lem','No account found with this email. <a href="#" data-switch="signup" style="color:var(--ember-dark);font-weight:700">Sign up?</a>');return}
if(u.hash!==await sha(pw)){setErr('lpw','Incorrect password. Please try again.');return}
ls('forgeSession',em);closeM();renderAuth();toast('Logged in. Welcome back, '+u.name.split(' ')[0]+'!')}};
const strength=p=>{let n=0;if(p.length>=8)n++;if(/[a-z]/.test(p)&&/[A-Z]/.test(p))n++;if(/\d/.test(p))n++;if(/[^A-Za-z0-9]/.test(p))n++;return n};
const openSignup=()=>{
mo(`<div class="auth-box"><h3>Create your account</h3><p class="sub">Sign up to book your free trial and manage your membership.</p>
<form id="sf" class="f" novalidate>
<label for="sn">Full name</label><input id="sn" autocomplete="name" placeholder="e.g. Karan Dhillon"><div class="err" id="e-sn"></div>
<label for="sem">Email</label><input id="sem" type="email" autocomplete="email" placeholder="you@example.com"><div class="err" id="e-sem"></div>
<label for="spw">Password</label>${eye('spw')}<div class="strength"><i id="sbar"></i></div><div class="err" id="e-spw"></div>
<label for="spw2">Confirm password</label>${eye('spw2')}<div class="err" id="e-spw2"></div>
<div class="formerr" id="serr"></div>
<button class="btn btn-primary btn-block" type="submit">Register</button></form>
<p class="alt">Already have an account? <a href="#" data-switch="login">Log in</a></p></div>`);
wireCommon();
$('#sem').addEventListener('blur',()=>{if($('#sem').value)fieldEmail('sem')});
$('#sem').addEventListener('input',()=>{$('#sem').classList.remove('ok');setErr('sem','')});
$('#sn').addEventListener('input',()=>{$('#sn').classList.remove('ok');setErr('sn','')});$('#sn').addEventListener('blur',()=>{if($('#sn').value)fieldName()});
$('#spw').addEventListener('input',()=>{const n=strength($('#spw').value),b=$('#sbar');b.style.width=(n*25)+'%';b.style.background=['#d33','#d33','#e8b34a','#6ab04c','#2e9e5b'][n];setErr('spw','')});
$('#spw2').addEventListener('input',()=>setErr('spw2',''));
$('#sf').onsubmit=async e=>{e.preventDefault();$('#serr').textContent='';let ok=true;
const nm=$('#sn').value.trim(),pw=$('#spw').value,pw2=$('#spw2').value;
if(!fieldName())ok=false;
if(!fieldEmail('sem'))ok=false;
if(pw.length<8){setErr('spw','Password must be at least 8 characters.');ok=false}
else if(!/[A-Za-z]/.test(pw)||!/\d/.test(pw)){setErr('spw','Use at least one letter and one number.');ok=false}
if(pw2!==pw){setErr('spw2','Passwords do not match.');ok=false}
if(!ok)return;
const em=$('#sem').value.trim().toLowerCase();
if(users()[em]){setErr('sem','An account with this email already exists. <a href="#" data-switch="login" style="color:var(--ember-dark);font-weight:700">Log in?</a>');return}
const name=$('#sn').value.trim(),U=users();U[em]={name,hash:await sha(pw),created:new Date().toLocaleString()};ls('forgeUsers',U);ls('forgeSession',em);renderAuth();
mo(`<div class="auth-box" style="text-align:center;padding:10px 0"><div style="font-size:2.6rem;color:#2e9e5b;line-height:1">✓</div><h3 style="margin-top:10px">You have been logged in</h3><p class="sub">Welcome to Forge, ${hx(name.split(' ')[0])}! Your account is ready.</p><button class="btn btn-primary btn-block" id="okBtn" type="button">Continue</button></div>`);
$('#okBtn').onclick=closeM;setTimeout(()=>{if($('#okBtn'))closeM()},2500)}};
const toast=m=>{let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#181818;color:#fff;border-left:4px solid var(--ember);padding:12px 18px;border-radius:4px;z-index:9500;font-size:.9rem;max-width:90vw;transition:opacity .3s';document.body.appendChild(t)}t.textContent=m;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,3500)};
const renderAuth=()=>{const u=me(),bar=$('#authbar');
if(u){bar.innerHTML=`<span class="uname">Hi, ${hx(u.name.split(' ')[0])}</span><button class="btn btn-outline-dark btn-small" id="logoutBtn" type="button">Log out</button>`;
$('#logoutBtn').onclick=()=>{localStorage.removeItem('forgeSession');renderAuth();toast('You have been logged out.')}}
else{bar.innerHTML='<button class="btn btn-outline-dark btn-small" id="loginBtn" type="button">Login</button><button class="btn btn-primary btn-small" id="signupBtn" type="button">Sign up</button>';
$('#loginBtn').onclick=openLogin;$('#signupBtn').onclick=openSignup}};
// "Book trial" / "Join" buttons: need an account first
goHook=(plan,prog,msg)=>{const u=me();if(!u){openSignup();return}
const L=ls('forgeLeads')||[];L.push({name:u.name,phone:'-',email:u.email,program:prog||'Not sure yet',plan:plan||'Not sure yet',time:'-',message:msg||'',at:new Date().toLocaleString()});ls('forgeLeads',L);
mo(`<h3>Request received</h3><p style="margin-top:8px">Thanks, ${hx(u.name.split(' ')[0])}! We have your free trial request${prog?' for <b>'+hx(prog)+'</b>':''}. We will email you at <b>${hx(u.email)}</b> to confirm a time.</p>`)};
document.addEventListener('click',e=>{const a=e.target.closest('[data-auth]');if(a){e.preventDefault();if(me()){goHook()}else{a.dataset.auth==='login'?openLogin():openSignup()}}});
renderAuth();

// newsletter + saved enquiries
$('#nl').onsubmit=e=>{e.preventDefault();const m=$('#nlm'),v=$('#nle').value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){m.textContent='Enter a valid email.';return}const N=ls('forgeNews')||[];N.push(v);ls('forgeNews',N);m.textContent='Subscribed. Thank you!';$('#nle').value=''};
$('#leads').onclick=e=>{e.preventDefault();const L=ls('forgeLeads')||[];mo('<h3>Saved enquiries</h3><p style="font-size:.8rem;margin-bottom:10px">Demo only: stored in this browser.</p>'+(L.length?L.map(l=>`<p style="border-top:1px solid var(--border-light);padding:8px 0;font-size:.85rem"><b>${esc(l.name).replace(/</g,'&lt;')}</b> · ${l.phone}<br>${l.program} / ${l.plan} / ${l.time}<br><small>${l.at}</small></p>`).join(''):'<p>No enquiries yet.</p>'))};
})();
