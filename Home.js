// ===== UTILIDADES =====
const $ = (q,ctx=document)=>ctx.querySelector(q);
const $$ = (q,ctx=document)=>[...ctx.querySelectorAll(q)];

// Año footer
$("#year").textContent = new Date().getFullYear();

// ===== NAV / BURGER =====
const burger = $("#burger");
const nav = $("#navLinks");
burger.addEventListener("click", ()=>{
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});

// Cerrar menú al navegar
$$('.nav-links a').forEach(a=>{
  a.addEventListener('click', ()=>{ if (window.innerWidth < 860) nav.style.display="none"; });
});

// Smooth scroll
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const target = $(a.getAttribute('href'));
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// ===== SCROLL PROGRESS BAR =====
const bar = $("#scrollbar");
const onScroll = ()=>{
  const h = document.documentElement;
  const scrolled = (h.scrollTop)/(h.scrollHeight - h.clientHeight);
  bar.style.width = (scrolled*100) + "%";
};
document.addEventListener("scroll", onScroll); onScroll();

// ===== REVEAL ON SCROLL (IntersectionObserver) =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
},{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

// ===== PARALLAX ORBS (mouse) =====
const orbs = $$('.orb');
document.addEventListener('mousemove', (e)=>{
  const {innerWidth:w, innerHeight:h} = window;
  const x = (e.clientX - w/2) / (w/2);
  const y = (e.clientY - h/2) / (h/2);
  orbs.forEach(o=>{
    const depth = parseFloat(o.dataset.depth || .1);
    o.style.transform = `translate(${x*20*depth}px, ${y*18*depth}px)`;
  });
});

// ===== TILT EN TARJETAS =====
$$('.tilt').forEach(card=>{
  let rect;
  const calc = (e)=>{
    rect = rect || card.getBoundingClientRect();
    const x = (e.clientX - rect.left)/rect.width - .5;
    const y = (e.clientY - rect.top)/rect.height - .5;
    card.style.transform = `rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`;
  };
  card.addEventListener('mousemove', calc);
  card.addEventListener('mouseleave', ()=>{ card.style.transform='translateY(0)'; rect=null; });
});

// ===== COUNTERS (métricas) =====
const counters = $$('.num');
const startCounter = (el)=>{
  const target = +el.dataset.target;
  const inc = Math.max(1, Math.floor(target/60));
  let n = 0;
  const tick = ()=>{
    n += inc;
    if(n >= target){ el.textContent = target; }
    else{ el.textContent = n; requestAnimationFrame(tick); }
  };
  tick();
};
const ioCount = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ startCounter(e.target); ioCount.unobserve(e.target); }
  });
},{threshold:.6});
counters.forEach(c=>ioCount.observe(c));

// ===== RIPPLE EN BOTONES =====
$$('.ripple').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const r = document.createElement('span');
    r.className = 'wave';
    const rect = btn.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = d+'px';
    r.style.left = (e.clientX - rect.left - d/2)+'px';
    r.style.top = (e.clientY - rect.top - d/2)+'px';
    btn.appendChild(r);
    setTimeout(()=>r.remove(), 600);
  });
});

// ===== FORM VALIDATION + TOAST =====
const form = $("#leadForm");
const toast = $("#toast");
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }
  // Aquí puedes integrar EmailJS / Formspree / PHP.
  toast.style.display = 'block';
  toast.style.opacity = '0';
  setTimeout(()=>{ toast.style.transition='opacity .3s'; toast.style.opacity='1'; }, 10);
  setTimeout(()=>{ toast.style.opacity='0'; }, 2400);
  setTimeout(()=>{ toast.style.display='none'; }, 2800);
  form.reset();
});


document.getElementById("leadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      empresa: form.empresa.value,
      correo: form.correo.value,
      telefono: form.telefono.value,
      mensaje: form.mensaje.value
    };

    try {
      const response = await fetch("https://hook.us2.make.com/g2j7g7wypp9idakzrh4tvm229c0w8kma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        document.getElementById("toast").style.display = "block";
        form.reset();
      } else {
        alert("Error al enviar el formulario. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión.");
    }
  });