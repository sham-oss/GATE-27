import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Cpu, Radio, Zap, BookOpen, Calendar, Target, CheckSquare, Layers,
  TrendingUp, AlertTriangle, Lightbulb, ChevronDown, ChevronRight,
  Activity, Clock, ListChecks, FileText, Repeat, Award, Gauge, Flame,
  Circle, CheckCircle2, Loader2, Upload, Bot, MessageSquare, Sparkles,
  Send, X, BookMarked,
} from "lucide-react";

/* ============================== DESIGN TOKENS ==============================
  bg        #0A1410   surface  #10201B   surface2 #16271F
  cyan      #4FD8C4   amber    #E8A33D   copper   #C97A52   red(T1) #E8704D
  text      #E9F2EE   dim      #87998F   border   #21342C
================================================================================ */

const C = {
  bg: "#0A1410",
  surface: "#10201B",
  surface2: "#16271F",
  cyan: "#4FD8C4",
  amber: "#E8A33D",
  copper: "#C97A52",
  red: "#E8704D",
  text: "#E9F2EE",
  dim: "#87998F",
  border: "#21342C",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap');`;

/* ============================== DATA ============================== */

const weightageData = [
  { name: "Comm. Sys", marks: 12 },
  { name: "Digital", marks: 11 },
  { name: "Analog", marks: 10 },
  { name: "GA", marks: 15 },
  { name: "Maths", marks: 13 },
  { name: "Networks", marks: 8 },
  { name: "Signals", marks: 8 },
  { name: "EDC", marks: 8 },
  { name: "EM Theory", marks: 8 },
  { name: "Control", marks: 7 },
];

const subjects = [
  {
    id: "maths",
    rank: 1,
    name: "Engineering Mathematics",
    icon: Cpu,
    marks: "13",
    difficulty: "Low–Med",
    verdict: "Free marks — non-negotiable mastery",
    tier1: ["Linear Algebra (Eigenvalues, Rank, Cayley-Hamilton)", "Differential Equations (LCCDE, resonance case)", "Probability & Statistics (Bayes, distributions)", "Calculus (Maxima-minima, multiple integrals)"],
    tier2: ["Vector Calculus (Gradient, Divergence, Curl, Stokes/Gauss)", "Numerical Methods (Newton-Raphson, Simpson's)"],
    tier3: ["Complex Variables (Cauchy-Riemann, residues)"],
    concepts: ["Eigenvalue properties (trace=Σλ, det=Πλ)", "Diagonalization conditions", "Cayley-Hamilton application", "LCCDE resonance-case PI", "Laplace transform of standard functions", "Bayes' theorem word problems", "Binomial/Poisson/Normal distributions", "Stokes' & Gauss divergence theorem", "Newton-Raphson convergence", "Rank-nullity theorem"],
    formulas: ["det(A−λI)=0,  trace(A)=Σλᵢ,  det(A)=Πλᵢ", "rank(A)+nullity(A)=n", "Resonance PI: multiply by x (or x²) if root repeats", "Bayes: P(A|B) = P(B|A)P(A)/P(B)", "Newton-Raphson: xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)", "Stokes: ∮F·dl = ∬(∇×F)·dS"],
    patterns: "Eigenvalues of A² or A⁻¹ from A's eigenvalues · LCCDE with resonance · Bayes' word problems · maxima-minima of 2-variable functions · rank of parametrized matrix.",
    mistakes: "Sign errors in cofactor expansion · forgetting ×x multiplier in resonance PI · misapplying Bayes' direction · divergence/curl sign slips.",
    shortcuts: "Eigenvalues of A⁻¹ = reciprocals of A's · for Aᵏ use λᵏ · symmetric matrix eigenvectors are always orthogonal — skip full diagonalization.",
    order: "Linear Algebra → Probability → Calculus → Diff. Equations → Vector Calculus → Numerical Methods → Complex Variables",
  },
  {
    id: "ga",
    rank: 2,
    name: "General Aptitude",
    icon: Target,
    marks: "15",
    difficulty: "Low",
    verdict: "Highest ROI subject in the entire exam",
    tier1: ["Quantitative Aptitude (Time-Speed-Distance, P&C, Profit-Loss)", "Verbal Ability (Grammar, RC, Critical reasoning)", "Logical Reasoning (Series, Blood relations, Syllogisms)"],
    tier2: ["Analytical/Spatial Aptitude (figure series, visual reasoning)"],
    tier3: [],
    concepts: ["Percentage-Profit-Loss shortcuts", "Time-Speed-Distance (relative speed, boats/streams)", "Time & Work (man-days)", "Permutations vs Combinations", "Ratio-Proportion-Mixtures (alligation)", "Data interpretation (bar/pie/line)", "Critical reasoning — assumption/conclusion", "Sentence correction", "Number series patterns", "Blood relation puzzles"],
    formulas: ["Relative speed: same dir |v1−v2|, opposite v1+v2", "SI = PNR/100,  CI = P(1+R/100)ⁿ−P", "Work rate = 1/days; combined = 1/(1/A+1/B)", "nPr = n!/(n−r)!,  nCr = n!/r!(n−r)!"],
    patterns: "Boats & streams · train crossing · 2-3 component mixtures · 2-step DI · critical reasoning 'which conclusion follows' · short RC passages.",
    mistakes: "Rushing RC and missing nuance · relative speed direction errors · over-thinking simple grammar · ignoring DI units.",
    shortcuts: "Net % change = a+b+ab/100 · use relative speed directly for crossing problems · round numbers in DI when options are far apart.",
    order: "Quant fundamentals (parallel, month 1) → Logical reasoning (ongoing) → Verbal (daily 15 min) → full 20-yr PYQ sets near exam",
  },
  {
    id: "networks",
    rank: 3,
    name: "Network Theory",
    icon: Zap,
    marks: "8",
    difficulty: "Medium",
    verdict: "Foundation for Analog/Control — very high repeat",
    tier1: ["Network Theorems (Thevenin, Norton, Superposition, Max Power Transfer)", "Transient Analysis (RL/RC/RLC, DC & AC)", "Two-Port Networks (Z, Y, H, ABCD)", "Resonance (Series/Parallel, Q-factor, BW)"],
    tier2: ["Sinusoidal steady-state / phasor analysis"],
    tier3: ["Graph theory of networks (tree, cut-set)", "Three-phase circuits"],
    concepts: ["Thevenin/Norton derivation", "Superposition with multiple sources", "Max power transfer (RL=Rth)", "RC/RL time constant τ", "RLC step response damping cases", "Initial/Final value theorem", "Z, Y, ABCD parameter relations", "Series resonance f₀, Q, BW", "Coupled circuits — dot convention", "Reciprocity & compensation theorems"],
    formulas: ["τ(RC)=RC, τ(RL)=L/R; v(t)=Vf+(Vi−Vf)e^(−t/τ)", "ω₀=1/√LC, Q=(1/R)√(L/C), BW=ω₀/Q", "Pmax = Vth²/4Rth", "ABCD: V1=AV2+BI2, I1=CV2+DI2; reciprocal ⇒ AD−BC=1", "M = k√(L1L2)"],
    patterns: "Thevenin resistance with dependent source · RL/RC switched at t=0 · two-port parameter conversion · resonant f & BW from R,L,C · superposition AC+DC.",
    mistakes: "Wrong handling of dependent sources in Thevenin · sign errors in mesh/node eqns · confusing τ for RL vs RC · improper initial conditions in Laplace transient.",
    shortcuts: "Use 1A test-source method for Thevenin with dependent sources only · ABCD of series R = [1,R;0,1], shunt R = [1,0;1/R,1] for fast cascading.",
    order: "Basic laws + node/mesh → Theorems → Transient (Laplace) → Resonance → Two-port → Coupled circuits",
  },
  {
    id: "signals",
    rank: 4,
    name: "Signals & Systems",
    icon: Activity,
    marks: "8",
    difficulty: "Med–High",
    verdict: "Concept-heavy, formula-driven, very repeatable",
    tier1: ["LTI Systems (Convolution, BIBO stability, causality)", "Fourier Series & Transform (CTFT, properties)", "Laplace Transform (ROC, pole-zero, stability)", "Z-Transform (ROC, inverse, stability)", "Sampling Theorem & Aliasing"],
    tier2: ["DTFT / DFT", "Signal classification & operations"],
    tier3: ["Random signals / correlation"],
    concepts: ["Convolution integral/sum", "Impulse response ⇄ transfer function", "BIBO stability condition", "Fourier series coefficients", "FT properties (shift, duality, Parseval)", "Laplace ROC rules", "Pole-zero ⇒ stability/causality", "Z-transform ROC properties", "Nyquist sampling fs≥2fm", "DFT circular convolution"],
    formulas: ["y(t)=∫x(τ)h(t−τ)dτ", "FT: rect(t/τ)↔τsinc(fτ); δ(t)↔1", "Final value: lim x(t)=lim sX(s), s→0", "Nyquist rate fs≥2fm; interval=1/2fm", "Parseval: ∫|x(t)|²dt=(1/2π)∫|X(ω)|²dω"],
    patterns: "Pole-zero plot ⇒ stability/causality/ROC · convolution of two simple signals · Fourier series of periodic waveform · sampling rate for bandlimited signal · Z-inverse via partial fractions + ROC.",
    mistakes: "Wrong ROC ⇒ wrong causality · sign errors in time-reversal/shift · confusing 1-sided vs 2-sided Laplace · forgetting stability needs jω-axis/unit-circle inclusion.",
    shortcuts: "Use transform-domain multiplication instead of graphical convolution where possible · exploit even/odd symmetry to nullify half the Fourier coefficients instantly.",
    order: "Classification → LTI & Convolution → Fourier Series → Fourier Transform → Laplace → Sampling → Z-Transform → DTFT/DFT",
  },
  {
    id: "digital",
    rank: 5,
    name: "Digital Circuits",
    icon: Layers,
    marks: "11",
    difficulty: "Low–Med",
    verdict: "Easiest high-weightage subject",
    tier1: ["Number Systems & Codes (Binary, BCD, Gray, complements)", "Boolean Algebra & K-Map", "Combinational Circuits (Adders, MUX, Decoders)", "Sequential Circuits (Flip-flops, Counters, Shift registers)"],
    tier2: ["FSM (Mealy/Moore)", "Memory (ROM/PLA/PAL)", "ADC/DAC"],
    tier3: ["Microprocessor/8085 basics"],
    concepts: ["Number base conversions & complements", "K-map SOP/POS with don't-cares", "Half/Full adder-subtractor", "Flip-flop excitation tables", "Flip-flop type conversion", "Mod-N counter design", "Shift register (ring/Johnson)", "Mealy vs Moore difference", "ADC types & conversion time", "Race-around condition (JK)"],
    formulas: ["2's complement = 1's complement + 1", "FFs needed for mod-N = ⌈log₂N⌉", "Max clock freq = 1/(t_setup+t_pd)", "DAC resolution = V_FS/(2ⁿ−1)", "Ripple counter delay = n×t_pd"],
    patterns: "K-map with don't-cares ⇒ minimal SOP/POS · mod-N counter using JK/D · flip-flop conversion (SR→JK etc.) · Mealy/Moore output sequence · ADC/DAC resolution numericals.",
    mistakes: "Non power-of-2 K-map groupings · confusing Mealy (input+state) vs Moore (state only) · 2's-complement subtraction sign error · ignoring accumulated ripple-counter delay.",
    shortcuts: "Always grab the largest K-map group first · for D flip-flop counters, D=Q_next directly, skip excitation table · memorize standard excitation tables instead of deriving.",
    order: "Number systems → Boolean/K-map → Combinational → Flip-flops → Counters/Shift regs → FSM → Memory → ADC/DAC",
  },
  {
    id: "analog",
    rank: 6,
    name: "Analog Circuits",
    icon: Radio,
    marks: "10",
    difficulty: "High",
    verdict: "Toughest core subject but unavoidable weightage",
    tier1: ["BJT/MOSFET Biasing & Small-Signal Analysis", "Amplifiers (CE/CC/CB, CS/CD/CG, freq. response)", "Operational Amplifiers (ideal, non-ideal, applications)", "Feedback Amplifiers (topologies, gain-BW tradeoff)"],
    tier2: ["Oscillators (RC, Wien, Crystal)", "Differential Amplifiers"],
    tier3: ["Power Amplifiers & Voltage Regulators", "Multivibrators (555/op-amp)"],
    concepts: ["BJT biasing stability factor S", "Hybrid-π small-signal model", "CE amplifier gain/impedance", "MOSFET small-signal (gm, ro)", "Miller effect & dominant pole", "Ideal op-amp assumptions", "Inverting/non-inverting/summing configs", "Feedback topologies & Zin/Zout effect", "Barkhausen criterion", "CMRR calculation"],
    formulas: ["gm=IC/VT (BJT); gm=2ID/(VGS−VTH) (MOSFET)", "CE gain ≈ −gm·(RC∥RL)", "Inverting gain=−Rf/Rin; Non-inv=1+Rf/Rin", "Barkhausen: |Aβ|=1, phase=0°/360°", "RC phase-shift osc: f=1/(2πRC√6)", "555 astable: T=0.693(R1+2R2)C", "CMRR(dB)=20log(Ad/Ac)"],
    patterns: "Q-point/stability factor for given bias circuit · small-signal gain/impedance numerical · op-amp multi-input circuit · oscillator type ID + frequency · CMRR numerical · feedback topology ID.",
    mistakes: "Forgetting AC equivalent conversion (short caps, kill DC sources) · inverting gain sign error · CMRR direction confusion · misidentifying feedback topology · ignoring RL loading.",
    shortcuts: "Memorize the 6 standard gain formulas instead of re-deriving · identify oscillator topology immediately and plug into standard formula · use virtual-ground trick for fast op-amp node equations.",
    order: "BJT/MOSFET physics recap → Biasing → Small-signal models → Single-stage amps → Freq. response → Feedback → Op-amp basics → Op-amp apps → Oscillators → Power amps (last)",
  },
  {
    id: "edc",
    rank: 7,
    name: "Electronic Devices",
    icon: Cpu,
    marks: "8",
    difficulty: "Medium",
    verdict: "Conceptual, theory-heavy, scoring once clear",
    tier1: ["Semiconductor Physics (carrier conc., Fermi level, drift-diffusion)", "PN Junction Diode (I-V, depletion width, capacitance)", "BJT Physics (operation, current components, Early effect)", "MOSFET Physics (Vth, regions, C-V characteristics)"],
    tier2: ["Special Diodes (Zener, Photodiode, LED, Varactor)"],
    tier3: ["Optoelectronics basics", "IC Fabrication basics"],
    concepts: ["np=ni² mass action law", "Fermi level in n/p-type semiconductors", "Drift & diffusion current", "Einstein relation D/μ=kT/q", "Built-in potential formula", "Depletion width ∝√V", "Diode Shockley equation", "α-β relation (β=α/1−α)", "Early effect", "MOSFET region-wise ID equations"],
    formulas: ["V0=(kT/q)ln(NA·ND/ni²)", "W ∝ √(V0+VR)", "I=I0(e^(V/VT)−1), VT≈26mV @300K", "β=α/(1−α), α=β/(1+β)", "ID(sat)=(1/2)μnCox(W/L)(VGS−VTH)²(1+λVDS)", "ID(triode)=μnCox(W/L)[(VGS−VTH)VDS−VDS²/2]"],
    patterns: "Depletion width/built-in potential numerical · BJT current relations (IC,IB→IE,α,β) · MOSFET ID in given region · region identification from voltages · C-V curve interpretation.",
    mistakes: "Confusing α and β formulas · sign error under forward vs reverse bias · wrong ID equation for the region · misreading C-V regions.",
    shortcuts: "Quick α-β mental conversion · region check first: VDS<VGS−VTH→triode, VDS≥→saturation, VGS<VTH→cutoff — before computing anything.",
    order: "Semiconductor physics → PN junction → Diode apps → BJT physics → MOSFET physics → Special diodes → Optoelectronics/Fab (last)",
  },
  {
    id: "comm",
    rank: 8,
    name: "Communication Systems",
    icon: Radio,
    marks: "12",
    difficulty: "Medium",
    verdict: "Highest weightage core subject — must master",
    tier1: ["Analog Modulation (AM, DSB-SC, SSB, FM, PM)", "Digital Modulation (ASK, FSK, PSK, QAM)", "Pulse Modulation (PCM, DM, DPCM)", "Information Theory (Entropy, Channel Capacity)"],
    tier2: ["Noise Analysis (SNR, Noise figure, Matched filter)", "Baseband Transmission (ISI, Nyquist, Eye diagram)", "Error Control Coding (Hamming code)"],
    tier3: ["Multiplexing (TDM, FDM)"],
    concepts: ["AM modulation index & power", "DSB-SC vs SSB bandwidth/power", "FM modulation index, Carson's rule", "PCM quantization (μ-law/A-law)", "PCM bit rate & SNR (6dB/bit)", "Shannon capacity C=Blog₂(1+S/N)", "Entropy calculation", "Constellation diagrams", "Nyquist criterion (zero ISI)", "Superheterodyne image frequency"],
    formulas: ["Pt=Pc(1+μ²/2)", "BW(Carson)=2(Δf+fm)=2fm(β+1)", "PCM bit rate = n×fs", "SNR improvement ≈ 6n dB", "C=Blog₂(1+S/N)", "H=−Σp(x)log₂p(x)", "2^r ≥ n+1 (Hamming)", "Image freq = fs+2fIF"],
    patterns: "AM/FM power & BW numerical · PCM bit rate/BW · channel capacity numerical · entropy from probability dist. · BER/SNR comparison · superheterodyne image frequency · constellation → bits/symbol.",
    mistakes: "Confusing AM vs FM modulation-index formulas · forgetting ×2 in Carson's rule · log-base errors in entropy/capacity · mixing SSB(=fm) vs DSB-SC(=2fm) bandwidth.",
    shortcuts: "Memorize standard BW table instead of deriving · '6dB per bit' gives instant PCM SNR answers · rank PSK>FSK>ASK for qualitative BER MCQs.",
    order: "AM family → FM/PM → Noise basics → Sampling & PCM → Delta modulation → Info theory → Digital modulation → Baseband/ISI → Error coding → Multiplexing (last)",
  },
  {
    id: "control",
    rank: 9,
    name: "Control Systems",
    icon: TrendingUp,
    marks: "7",
    difficulty: "Medium",
    verdict: "Formula + graphical, very scoring with practice",
    tier1: ["Time Domain Analysis (order, type, transient/SS response)", "Stability (Routh-Hurwitz)", "Root Locus", "Frequency Domain (Bode, Nyquist, GM/PM)"],
    tier2: ["Block Diagram Reduction & SFG", "State Space Analysis"],
    tier3: ["Compensators (Lead/Lag)", "PID Controllers"],
    concepts: ["2nd order params (ζ, ωn, Mp, tr, ts)", "Steady-state error coefficients", "Routh array + special cases", "Root locus construction rules", "Bode magnitude/phase plot", "GM & PM definitions", "Nyquist N=Z−P", "Mason's gain formula", "Controllability/observability", "Lead vs Lag compensator effect"],
    formulas: ["Mp=e^(−ζπ/√(1−ζ²)); tr≈1.8/ωn; ts(2%)=4/ζωn", "ess: 1/(1+Kp) step; 1/Kv ramp; 1/Ka parabolic", "T=Σ(Pk·Δk)/Δ (Mason's)", "GM(dB)=−20log|G(jω)| at phase crossover", "PM=180°+phase at gain crossover", "N=Z−P (Nyquist)"],
    patterns: "Routh-Hurwitz for range of K · root locus point's K value · Bode slope/GM/PM calculation · steady-state error for system type+input · block diagram reduction · state-space ⇄ TF conversion.",
    mistakes: "Sign errors in Routh array · mishandling all-zero row (need auxiliary polynomial) · confusing GM vs PM · wrong Bode slope counting.",
    shortcuts: "Routh range-of-K: check last row sign first · root locus real-axis segments via odd pole+zero count to the right · Bode slope via pole/zero corner-frequency counting, no exact magnitude needed.",
    order: "TF/block diagrams → Time-domain response → Routh-Hurwitz → Root locus → Bode plots → Nyquist → State-space → Compensators (last)",
  },
  {
    id: "em",
    rank: 10,
    name: "Electromagnetics",
    icon: Zap,
    marks: "8",
    difficulty: "High",
    verdict: "Abstract — master high-frequency topics selectively",
    tier1: ["Transmission Lines (Z0, VSWR, Smith chart, matching)", "Maxwell's Equations (forms, boundary conditions)"],
    tier2: ["Waveguides (TE/TM modes, cutoff freq.)", "Plane Wave Propagation (polarization, reflection)", "Antenna Basics", "Electrostatics/Magnetostatics"],
    tier3: ["Smith Chart deep applications"],
    concepts: ["Maxwell's 4 equations (differential form)", "E/H boundary conditions", "Z0=√(L/C)", "Reflection coefficient Γ", "VSWR formula", "Quarter/half-wave transformer", "Plane wave in lossless/lossy media", "Brewster angle", "TE10 cutoff frequency", "Poynting vector"],
    formulas: ["Z0=√(L/C); Γ=(ZL−Z0)/(ZL+Z0); VSWR=(1+|Γ|)/(1−|Γ|)", "Quarter-wave: Zin=Z0²/ZL", "η0=√(μ0/ε0)=377Ω", "fc(TE10)=c/2a", "vp=c/√(1−(fc/f)²); vg=c√(1−(fc/f)²)", "tanθB=n2/n1"],
    patterns: "Zin of line via formula/Smith chart · Γ/VSWR numerical · quarter-wave transformer matching · waveguide cutoff frequency · boundary condition application · plane wave parameters in a medium.",
    mistakes: "Reflection-coefficient sign error · TE vs TM field confusion · unit slip (GHz/cm) in cutoff freq. · misapplied boundary conditions · Smith-chart reading errors (biggest time sink).",
    shortcuts: "Quarter-wave: Zin=Z0²/ZL directly, skip Smith chart · matched line ⇒ Γ=0, VSWR=1 (sanity check) · TE10 cutoff depends only on dimension 'a'.",
    order: "Electrostatics/Magnetostatics recap → Maxwell's equations → Plane waves → Transmission lines (priority) → Waveguides → Antennas (last)",
  },
];

/* ============================== PYQ PRACTICE BANK ==============================
   Original GATE-style practice questions, modeled on the most frequently recurring
   PYQ patterns per topic (NOT verbatim official questions). Organized so a student
   can immediately drill a topic right after finishing it.
================================================================================ */

const pyqBank = {
  maths: [
    {
      topic: "Linear Algebra", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A 3×3 matrix A has trace 9. Two of its eigenvalues are 2 and 3. Find the third eigenvalue.", answer: "4", solution: "trace(A) = sum of eigenvalues = 9. So λ₃ = 9 − 2 − 3 = 4.", shortcut: "Never expand the full characteristic polynomial if you're only asked for one eigenvalue and the others are given — trace and determinant alone often solve it in one line." },
        { type: "NAT", difficulty: "Medium", q: "A is a 3×3 matrix with eigenvalues 1, −2, 3. Find det(A³).", answer: "−216", solution: "det(A) = 1×(−2)×3 = −6. For Aᵏ, eigenvalues become λᵏ, so det(A³) = det(A)³ = (−6)³ = −216.", shortcut: "det(Aᵏ) = [det(A)]ᵏ always — never recompute eigenvalues of A³ individually." },
      ],
    },
    {
      topic: "Differential Equations", freq: "Very High",
      qs: [
        { type: "MCQ", difficulty: "Medium", q: "For y″ − 3y′ + 2y = e^(2x), what form should the particular integral take?", options: ["A e^(2x)", "A x e^(2x)", "A x² e^(2x)", "A e^x"], answer: "A x e^(2x)", solution: "Auxiliary equation: r²−3r+2=0 → roots r=1,2. Since RHS = e^(2x) matches root r=2 (resonance/repeated case), multiply the trial PI by x.", shortcut: "Before solving anything, just check: does the RHS's exponent match a root of the auxiliary equation? If yes → multiply trial solution by x (or x² if root repeats twice). This alone answers most 1-mark PI-form questions." },
        { type: "Conceptual", difficulty: "Medium", q: "Solve d²y/dx² + y = sin x for the particular integral (resonance case).", answer: "yp = −(x/2)cos x", solution: "Since sin x is also a solution of the homogeneous equation (roots ±j), this is the resonance case. Standard result: yp = −(x/2)cos x.", shortcut: "Memorize this exact resonance result for y″+y=sin x or cos x — it repeats almost every cycle in some form." },
      ],
    },
    {
      topic: "Probability & Statistics", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "In a binary channel, P(0 sent)=0.6, P(1 sent)=0.4. P(error|0 sent)=0.1, P(error|1 sent)=0.2. Given an error occurred, find P(0 was sent).", answer: "3/7 ≈ 0.4286", solution: "P(error) = 0.6×0.1 + 0.4×0.2 = 0.06+0.08 = 0.14. By Bayes: P(0|error) = 0.06/0.14 = 3/7.", shortcut: "Always compute the denominator P(error) first as a weighted sum — write it out fully before dividing, that's where most sign/term-dropping errors happen." },
        { type: "NAT", difficulty: "Easy", q: "X is Poisson distributed with mean 2. Find P(X ≥ 1).", answer: "≈ 0.8647", solution: "P(X≥1) = 1 − P(X=0) = 1 − e^(−2) = 1 − 0.1353 = 0.8647.", shortcut: "For 'at least 1' questions with any distribution, always compute the complement P(X=0) — it's almost always faster." },
      ],
    },
    {
      topic: "Vector Calculus", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "Find the divergence of F = x²i + y²j + z²k at point (1,1,1).", answer: "6", solution: "∇·F = ∂(x²)/∂x + ∂(y²)/∂y + ∂(z²)/∂z = 2x+2y+2z. At (1,1,1): 2+2+2=6.", shortcut: "Divergence questions are pure differentiation — never overthink, just differentiate each component w.r.t. its own variable and add." },
        { type: "Conceptual", difficulty: "Medium", q: "Is F = 2xy i + (x²−z²) j − 2yz k conservative?", answer: "Yes (curl F = 0)", solution: "∇×F = (∂(−2yz)/∂y − ∂(x²−z²)/∂z, ∂(2xy)/∂z − ∂(−2yz)/∂x, ∂(x²−z²)/∂x − ∂(2xy)/∂y) = (−2z−(−2z), 0−0, 2x−2x) = (0,0,0). Curl is zero, so F is conservative.", shortcut: "For 'is it conservative' MCQs, you only need ONE non-zero curl component to immediately answer 'No' — don't always compute all three if the first one already breaks it." },
      ],
    },
  ],

  ga: [
    {
      topic: "Quantitative Aptitude", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A boat travels 30 km downstream in 2 hours and returns upstream in 3 hours. Find the boat's speed in still water.", answer: "12.5 km/h", solution: "Downstream speed = 30/2 = 15 km/h. Upstream speed = 30/3 = 10 km/h. Boat speed = (15+10)/2 = 12.5 km/h. Stream speed = (15−10)/2 = 2.5 km/h.", shortcut: "Boat speed = average of down/up speeds; stream speed = half their difference. Memorize both as one-liners — never set up two separate equations." },
        { type: "NAT", difficulty: "Easy", q: "In how many ways can the letters of the word 'ENGINE' be arranged?", answer: "180", solution: "6 letters, with E repeating twice and N repeating twice. Arrangements = 6!/(2!×2!) = 720/4 = 180.", shortcut: "Always scan for repeated letters FIRST before applying 6! — this single check prevents the most common P&C error." },
      ],
    },
    {
      topic: "Verbal Ability", freq: "Very High",
      qs: [
        { type: "MCQ", difficulty: "Easy", q: "Choose the grammatically correct sentence.", options: ["Neither of the students have submitted the assignment.", "Neither of the students has submitted the assignment.", "Neither of the student have submitted the assignment.", "Neither of the students submit the assignment."], answer: "Neither of the students has submitted the assignment.", solution: "'Neither' is singular, so it takes a singular verb 'has', regardless of the plural noun that follows 'of'.", shortcut: "Words like neither, either, each, everyone are always singular — ignore the plural noun after 'of' when picking the verb." },
        { type: "MCQ", difficulty: "Medium", q: "All engineers are punctual. Some punctual people are doctors. Which conclusion follows?", options: ["All engineers are doctors.", "Some doctors are engineers.", "No valid conclusion follows.", "All doctors are punctual."], answer: "No valid conclusion follows.", solution: "Two 'some/all' statements with the middle term 'punctual' distributed only partially cannot yield a valid syllogistic conclusion linking engineers and doctors directly.", shortcut: "If the shared middle term isn't fully distributed in at least one premise, the safe answer is almost always 'no valid conclusion'." },
      ],
    },
    {
      topic: "Logical Reasoning", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "Find the next term: 2, 6, 12, 20, 30, ?", answer: "42", solution: "Differences are 4,6,8,10,12 — i.e., terms follow n(n+1): 1×2,2×3,3×4,4×5,5×6,6×7=42.", shortcut: "For series with growing gaps, check if terms fit n(n+1) or n² ± n patterns before trying anything more complex." },
        { type: "MCQ", difficulty: "Medium", q: "Pointing to a photograph, a man says, 'She is the daughter of my grandfather's only son.' How is she related to the man?", options: ["Daughter", "Sister", "Niece", "Cousin"], answer: "Sister", solution: "Grandfather's only son = the man's father (since the man himself is one generation below). Daughter of his father = his sister.", shortcut: "In blood-relation puzzles, always rewrite the chain starting from the speaker ('my') and resolve one relation at a time instead of holding it all in your head." },
      ],
    },
  ],

  networks: [
    {
      topic: "Network Theorems", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A 20V source in series with 4Ω feeds node X, which connects to ground via 6Ω. A 12Ω load (to be removed) also sits from node X to ground. Find Vth and Rth at node X (load removed).", answer: "Vth = 12V, Rth = 2.4Ω", solution: "With 12Ω removed: Vth = 20×6/(4+6) = 12V (voltage divider). Deactivating the source (short it): Rth = 4Ω∥6Ω = (4×6)/10 = 2.4Ω.", shortcut: "Open-circuit voltage = simple voltage divider once the load is removed; Thevenin resistance = parallel combination once independent sources are killed. Do these as two separate, quick sub-steps." },
        { type: "NAT", difficulty: "Medium", q: "Using superposition, a 10V source alone produces 1A (left→right) through R, and a 2A current source alone produces 0.6A (right→left) through the same R. Find the net current.", answer: "0.4A (left→right)", solution: "Net current = 1A − 0.6A = 0.4A in the direction of the larger contribution (left→right).", shortcut: "Always fix one reference direction before adding contributions — opposite-direction contributions subtract, this is the #1 superposition sign mistake." },
      ],
    },
    {
      topic: "Transient Analysis", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A capacitor charged to 10V discharges through R=2kΩ, C=100µF. Find the voltage at t=200ms.", answer: "≈ 3.68V", solution: "τ = RC = 2000×100×10⁻⁶ = 0.2s = 200ms. v(t)=10×e^(−t/τ)=10×e⁻¹=3.68V.", shortcut: "Whenever t = τ exactly, the answer is always 36.8% of the initial value for discharge (or 63.2% of final value for charging) — memorize this so you can skip the exponent calculation entirely." },
        { type: "Conceptual", difficulty: "Easy", q: "In a step-excited RL circuit, what fraction of the final current is reached at t=τ?", answer: "63.2%", solution: "i(t) = I_final(1−e^(−t/τ)). At t=τ: i(τ) = I_final(1−e⁻¹) = I_final×0.632.", shortcut: "63.2% at t=τ, 86.5% at t=2τ, 95% at t=3τ — memorize this table instead of recomputing exponentials each time." },
      ],
    },
    {
      topic: "Two-Port Networks", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A symmetric reciprocal two-port has Z11=10, Z12=Z21=5, Z22=10 (all Ω). Find Y11.", answer: "0.133 S", solution: "Y = Z⁻¹. det(Z)=10×10−5×5=75. Y11 = Z22/det(Z) = 10/75 = 0.133 S.", shortcut: "For 2×2 Z→Y conversion, memorize the cross-formula directly: Y11=Z22/ΔZ, Y22=Z11/ΔZ, Y12=Y21=−Z12/ΔZ — never invert the matrix from scratch under time pressure." },
        { type: "MCQ", difficulty: "Easy", q: "For a reciprocal two-port network in ABCD parameters, which condition holds?", options: ["A=D", "AD−BC=1", "AB=CD", "A+D=1"], answer: "AD−BC=1", solution: "Reciprocity in ABCD form is defined by AD−BC=1.", shortcut: "This single identity is a fast sanity check — if a computed ABCD set doesn't satisfy AD−BC=1, you've made an arithmetic error somewhere." },
      ],
    },
    {
      topic: "Resonance", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A series RLC circuit has R=10Ω, L=0.1H, C=10µF. Find the resonant frequency f0 and Q-factor.", answer: "f0 ≈ 159.15 Hz, Q = 10", solution: "ω0=1/√(LC)=1/√(0.1×10×10⁻⁶)=1000 rad/s → f0=ω0/2π=159.15Hz. Q=ω0L/R=1000×0.1/10=10.", shortcut: "Compute ω0 first (cleaner numbers), only convert to f0 at the very last step if the question asks for Hz." },
        { type: "Conceptual", difficulty: "Easy", q: "At resonance in a series RLC circuit, what happens to impedance and current?", answer: "Impedance minimum (=R), current maximum", solution: "At resonance, XL=XC so they cancel, leaving Z=R (purely resistive, minimum magnitude) — hence current is maximum.", shortcut: "Series resonance = minimum impedance = maximum current; parallel resonance = maximum impedance = minimum current. Keep these as opposite pairs." },
      ],
    },
  ],

  signals: [
    {
      topic: "LTI Systems & Convolution", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "Convolve x[n] = {1,1,1} (n=0,1,2) with h[n] = {1,1} (n=0,1). Find y[n] for n=0 to 3.", answer: "y[n] = {1, 2, 2, 1}", solution: "y[n]=Σx[k]h[n−k]. y[0]=1×1=1. y[1]=1×1+1×1=2. y[2]=1×1+1×1=2. y[3]=1×1=1.", shortcut: "Output length = len(x)+len(h)−1. For short sequences, just slide and multiply-add directly — skip the formal flip-and-slide diagram." },
        { type: "Conceptual", difficulty: "Easy", q: "A system has h(t)=e^(−2t)u(t). Is it causal and BIBO stable?", answer: "Yes to both", solution: "h(t)=0 for t<0 → causal. ∫₀^∞|e^(−2t)|dt = 1/2 < ∞ → BIBO stable.", shortcut: "Causality: check if h(t)=0 for t<0. Stability: check if ∫|h(t)|dt converges. These are two independent, one-line checks — never confuse them." },
      ],
    },
    {
      topic: "Fourier Series & Transform", freq: "Very High",
      qs: [
        { type: "Conceptual", difficulty: "Easy", q: "Find the Fourier transform of x(t)=e^(−3t)u(t).", answer: "X(jω) = 1/(3+jω)", solution: "Direct standard pair: e^(−at)u(t) ↔ 1/(a+jω) for a>0. Here a=3.", shortcut: "Build a personal 'transform pairs' card of the 10 most-used FT pairs — this question type is pure lookup, never derive from the integral under time pressure." },
        { type: "Conceptual", difficulty: "Medium", q: "A periodic square wave (even function, 50% duty cycle, amplitude ±1) — what type of harmonics and terms appear in its Fourier series?", answer: "Only odd harmonics, only cosine terms", solution: "Even symmetry → only cosine (a₀, aₙ) terms, bₙ=0. Half-wave symmetry → only odd harmonics survive.", shortcut: "Check symmetry FIRST (even/odd, half-wave) before computing any Fourier coefficient — it instantly tells you which terms are zero, often eliminating half the work." },
      ],
    },
    {
      topic: "Laplace Transform", freq: "Very High",
      qs: [
        { type: "Conceptual", difficulty: "Medium", q: "X(s)=1/(s+2), ROC: Re(s) > −2. Determine causality and stability.", answer: "Causal and stable", solution: "Right-sided ROC (Re(s) > pole) → causal. ROC includes the jω-axis (since −2<0) → stable.", shortcut: "Two checks, always in this order: (1) is ROC right-sided (causal) or left-sided (anti-causal)? (2) does ROC include the jω-axis (stable)? Never skip checking both." },
        { type: "Conceptual", difficulty: "Hard", q: "A system has a pole at s=3 with ROC Re(s) < 3. Determine causality and stability.", answer: "Anti-causal but stable", solution: "Left-sided ROC → anti-causal. But ROC Re(s)<3 still includes Re(s)=0 (the jω-axis), so the system IS stable despite having a right-half-plane pole.", shortcut: "Classic trap: an RHP pole doesn't automatically mean instability — it depends entirely on which ROC is chosen. Always verify against the ROC, never the pole location alone." },
      ],
    },
    {
      topic: "Z-Transform", freq: "High",
      qs: [
        { type: "Conceptual", difficulty: "Hard", q: "X(z) has poles at z=0.5 and z=2. Can the system be both causal and stable?", answer: "No", solution: "Causal needs ROC |z|>2 (outside outermost pole) — but this excludes the unit circle, so unstable. The only stable ROC is 0.5<|z|<2, which is two-sided (non-causal).", shortcut: "If any pole lies outside the unit circle, a causal+stable combination is impossible — check this in 2 seconds before attempting any ROC selection." },
        { type: "NAT", difficulty: "Easy", q: "Find X(z) for x[n]=(0.5)ⁿu[n], then evaluate X(2).", answer: "X(z)=1/(1−0.5z⁻¹); X(2)=1.333", solution: "Standard pair: aⁿu[n] ↔ 1/(1−az⁻¹), ROC |z|>a. X(2)=1/(1−0.5×0.5)=1/0.75=1.333.", shortcut: "Memorize aⁿu[n] ↔ 1/(1−az⁻¹) cold — it's the single most-used Z-transform pair in the entire syllabus." },
      ],
    },
    {
      topic: "Sampling Theorem", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A signal has maximum frequency 4kHz. Find the minimum (Nyquist) sampling rate.", answer: "8 kHz", solution: "Nyquist rate = 2×fmax = 2×4kHz = 8kHz.", shortcut: "Nyquist rate is always exactly 2×fmax — don't overthink, it's a single multiplication." },
        { type: "NAT", difficulty: "Medium", q: "x(t)=cos(2π×6000t) is sampled at fs=8000Hz. Find the aliased (folded) frequency.", answer: "2000 Hz", solution: "Since f=6000Hz > fs/2=4000Hz, it aliases. Fold around fs/2: alias = 2×4000−6000 = 2000Hz.", shortcut: "Whenever the signal frequency exceeds fs/2, fold it: alias = |fs − f| if f is between fs/2 and fs. This avoids redrawing spectra." },
      ],
    },
  ],

  digital: [
    {
      topic: "Number Systems & Codes", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "Convert (173)₁₀ to binary, then to Gray code.", answer: "Binary = 10101101, Gray = 11111011", solution: "173 = 10101101₂. Gray code: G = B XOR (B>>1). 10101101 XOR 01010110 = 11111011.", shortcut: "Gray code from binary is always B XOR (B shifted right by 1) — write this as one XOR operation, never compute bit-by-bit from the MSB rule manually." },
        { type: "NAT", difficulty: "Easy", q: "Find the 2's complement of (01101)₂ (5-bit).", answer: "10011", solution: "1's complement = 10010. Add 1 → 10011.", shortcut: "Shortcut for 2's complement directly: keep all bits up to and including the first '1' from the right unchanged, flip everything to its left. Here: 01101 → keep '...01' (rightmost 1 and trailing 0s), flip the rest → 10011." },
      ],
    },
    {
      topic: "Boolean Algebra & K-Map", freq: "Very High",
      qs: [
        { type: "Conceptual", difficulty: "Medium", q: "Minimize F(A,B,C) = Σm(0,1,2,3,5,7) using a K-map.", answer: "F = A′ + AC", solution: "Minterms 0,1,2,3 (A=0 for all) group to A′. Minterms 5,7 (both have A=1,C=1) group to AC. F = A′ + AC.", shortcut: "Always look for the largest group first (4-cell before 2-cell) — grouping A=0 as one block of four instantly handles half the minterms in one term." },
        { type: "Conceptual", difficulty: "Hard", q: "Minimize F(A,B,C)=Σm(0,2,3,7)+Σd(4,6) using don't-cares.", answer: "F = B + C′", solution: "Group m0,4(dc) → B′C′. Group m2,3,6(dc),7 → B. Combined: F=B+B′C′, which by absorption simplifies to F=B+C′.", shortcut: "After grouping, always check for absorption (X + X′Y = X+Y) — it often shrinks a 2-term SOP into something even smaller, as it does here." },
      ],
    },
    {
      topic: "Combinational Circuits", freq: "High",
      qs: [
        { type: "Conceptual", difficulty: "Medium", q: "Implement F(A,B,C)=Σm(1,3,5,6) using an 8:1 MUX with select lines A,B,C.", answer: "Set data inputs D1=D3=D5=D6=1, all others=0", solution: "With select lines tied directly to A,B,C, each MUX data input corresponds exactly to one minterm — no Boolean simplification needed, just read minterms directly into the data lines.", shortcut: "For an n-select-line MUX matching the number of variables exactly, skip K-map simplification entirely — just wire 1s to the minterm-numbered inputs." },
        { type: "NAT", difficulty: "Easy", q: "A 4-bit full adder adds A=0110 and B=0011 with Cin=0. Find Sum and Cout.", answer: "Sum=1001, Cout=0", solution: "6+3=9 → 1001 in binary, which fits in 4 bits, so Cout=0.", shortcut: "Convert to decimal, add, reconvert to binary — much faster than bit-by-bit carry propagation for verification-style questions." },
      ],
    },
    {
      topic: "Sequential Circuits", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "What is the minimum number of flip-flops required for a MOD-5 synchronous counter?", answer: "3", solution: "Flip-flops needed = ⌈log₂5⌉ = ⌈2.32⌉ = 3.", shortcut: "⌈log₂N⌉ — round UP always, even if N is just barely over a power of 2 (e.g., MOD-5 still needs 3 FFs, same as MOD-8)." },
        { type: "Conceptual", difficulty: "Medium", q: "Find the excitation equation D (in terms of J,K,Q) to make a JK flip-flop behave as a D flip-flop.", answer: "D = JQ′ + K′Q", solution: "To convert JK→D behavior, derive from the JK excitation table mapped against desired D-FF transitions: D = JQ′+K′Q is the standard conversion result.", shortcut: "Flip-flop conversion formulas (SR→JK, JK→D, JK→T etc.) should be memorized as a fixed table — deriving them from scratch in the exam wastes 3-4 precious minutes." },
      ],
    },
  ],

  analog: [
    {
      topic: "BJT/MOSFET Biasing & Small-Signal", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A BJT has IC=2mA at room temperature (VT=26mV). Find gm.", answer: "≈ 76.9 mA/V", solution: "gm = IC/VT = 2mA/26mV = 76.9 mA/V.", shortcut: "gm=IC/VT — at room temp VT≈26mV is essentially a constant, so gm scales linearly with bias current. Memorize gm≈IC(mA)/26 mA/V as a quick mental shortcut." },
        { type: "NAT", difficulty: "Easy", q: "A MOSFET has ID=4mA and (VGS−VTH)=2V. Find gm.", answer: "4 mA/V", solution: "gm = 2ID/(VGS−VTH) = 2×4mA/2V = 4mA/V.", shortcut: "Unlike BJT's gm=IC/VT, MOSFET's gm formula always has a factor of 2 in the numerator — don't mix the two formulas up under pressure." },
      ],
    },
    {
      topic: "Amplifiers & Frequency Response", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A CE amplifier has gm=40mA/V, RC=2kΩ in parallel with RL=2kΩ. Find the midband voltage gain.", answer: "−40", solution: "RC∥RL = 1kΩ. Av = −gm×(RC∥RL) = −40mA/V×1kΩ = −40.", shortcut: "Always compute RC∥RL first as a single number before multiplying by gm — don't carry two separate resistances through the gain formula." },
        { type: "NAT", difficulty: "Medium", q: "An amplifier has a dominant pole at fH=1MHz. Find the rise time tr.", answer: "0.35 µs", solution: "tr = 0.35/fH = 0.35/1×10⁶ = 0.35µs.", shortcut: "tr×fH=0.35 is a fixed constant — memorize it instead of deriving from the step-response exponential each time." },
      ],
    },
    {
      topic: "Operational Amplifiers", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "An inverting amplifier has Rf=20kΩ, Rin=2kΩ. Find the closed-loop gain.", answer: "−10", solution: "Av = −Rf/Rin = −20k/2k = −10.", shortcut: "Inverting gain magnitude = Rf/Rin always — the negative sign is automatic, don't second-guess it." },
        { type: "NAT", difficulty: "Medium", q: "A difference amplifier has R1=R2=1kΩ, Rf=Rg=10kΩ, V1=1V, V2=2V. Find Vout.", answer: "10V", solution: "For matched resistors: Vout = (Rf/R1)(V2−V1) = (10k/1k)(2−1) = 10×1 = 10V.", shortcut: "When all four resistors satisfy Rf/R1=Rg/R2, the formula collapses to a simple gain × (V2−V1) — verify the matching condition first before plugging numbers in." },
      ],
    },
    {
      topic: "Feedback Amplifiers", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "An amplifier has open-loop gain A=1000, feedback factor β=0.09. Find the closed-loop gain.", answer: "≈ 11", solution: "Af = A/(1+Aβ) = 1000/(1+90) = 1000/91 ≈ 10.99 ≈ 11.", shortcut: "When Aβ≫1 (deep feedback), Af≈1/β as a quick sanity check — here 1/0.09≈11.1, matching closely." },
        { type: "NAT", difficulty: "Medium", q: "Open-loop bandwidth=10kHz, gain=1000, closed-loop gain Af=100 (so Aβ=9). Find closed-loop bandwidth.", answer: "100 kHz", solution: "BWf = BW×(1+Aβ) = 10kHz×10 = 100kHz.", shortcut: "Gain-bandwidth product is conserved: A×BW = Af×BWf. Use this single identity instead of recomputing (1+Aβ) separately if you already know both gains." },
      ],
    },
  ],

  edc: [
    {
      topic: "Semiconductor Physics", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "An intrinsic semiconductor has ni=1.5×10¹⁰/cm³. Doped with ND=10¹⁶/cm³, find the minority carrier (hole) concentration.", answer: "≈ 2.25×10⁴ /cm³", solution: "p = ni²/n ≈ ni²/ND = (1.5×10¹⁰)²/10¹⁶ = 2.25×10²⁰/10¹⁶ = 2.25×10⁴ /cm³.", shortcut: "Mass-action law np=ni² lets you find the minority carrier directly without ever computing the majority carrier concentration separately — n≈ND for n-type is a safe approximation." },
        { type: "NAT", difficulty: "Hard", q: "Find the built-in potential of a PN junction with NA=10¹⁷, ND=10¹⁵, ni=1.5×10¹⁰ at T=300K (VT=26mV).", answer: "≈ 0.7 V", solution: "V0 = VT ln(NA·ND/ni²) = 0.026×ln(10¹⁷×10¹⁵/(2.25×10²⁰)) = 0.026×ln(4.44×10¹¹) ≈ 0.026×26.8 ≈ 0.7V.", shortcut: "Built-in potential for typical silicon doping levels almost always lands between 0.6–0.8V — use this as a sanity check on your computed answer." },
      ],
    },
    {
      topic: "PN Junction Diode", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A diode has I0=1nA. Find the forward voltage for a forward current of 1mA (VT=26mV).", answer: "≈ 0.36 V", solution: "V = VT ln(I/I0) = 0.026×ln(10⁻³/10⁻⁹) = 0.026×ln(10⁶) = 0.026×13.8 ≈ 0.359V.", shortcut: "ln(10⁶)=6ln(10)=6×2.303=13.8 — memorize ln(10)≈2.3 so you never need a calculator for these power-of-10 ratio questions." },
        { type: "Conceptual", difficulty: "Easy", q: "How does junction capacitance vary with increasing reverse bias?", answer: "Decreases", solution: "Cj ∝ 1/√(V0+VR). As reverse bias VR increases, depletion width increases, so Cj decreases.", shortcut: "Wider depletion width = lower capacitance — think of it like a parallel-plate capacitor where the depletion region is the 'gap' between plates." },
      ],
    },
    {
      topic: "BJT Physics", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A transistor has IE=2mA, IB=0.02mA. Find α and β.", answer: "α=0.99, β=99", solution: "IC=IE−IB=1.98mA. α=IC/IE=0.99. β=α/(1−α)=0.99/0.01=99 (cross-check: β=IC/IB=1.98/0.02=99 ✓).", shortcut: "Always compute α first from IC/IE, then get β=α/(1−α) — going the other way (estimating β first) is more error-prone." },
        { type: "NAT", difficulty: "Easy", q: "β=100, IB=10µA. Find IC and IE.", answer: "IC=1mA, IE=1.01mA", solution: "IC=β×IB=100×10µA=1mA. IE=IC+IB=1mA+0.01mA=1.01mA.", shortcut: "When β is large (>50), IE≈IC is a safe quick approximation for sanity-checking your final answer." },
      ],
    },
    {
      topic: "MOSFET Physics", freq: "Very High",
      qs: [
        { type: "Conceptual", difficulty: "Medium", q: "A MOSFET has VTH=1V, VGS=3V, VDS=1V. Identify the region of operation.", answer: "Triode (linear) region", solution: "VGS−VTH=2V. Since VDS(1V) < VGS−VTH(2V), the device is in the triode region.", shortcut: "Always compute VGS−VTH first as your reference, then just compare VDS against it — this single comparison answers nearly every region-identification question." },
        { type: "NAT", difficulty: "Medium", q: "Same MOSFET, k=μnCox(W/L)=2mA/V². Find ID at VDS=4V (λ=0).", answer: "4 mA", solution: "VDS(4V) > VGS−VTH(2V) → saturation. ID=(1/2)k(VGS−VTH)²=(1/2)(2m)(2)²=4mA.", shortcut: "Region check (triode vs saturation) must always come BEFORE picking which ID formula to use — using the saturation formula in triode (or vice versa) is the single most common EDC numerical mistake." },
      ],
    },
  ],

  comm: [
    {
      topic: "Analog Modulation (AM/FM)", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "An AM signal has Pc=100W and modulation index μ=0.8. Find the total transmitted power.", answer: "132 W", solution: "Pt = Pc(1+μ²/2) = 100(1+0.32) = 132W.", shortcut: "μ²/2 is the fractional power added by both sidebands combined — memorize that at μ=1 (100% modulation), sidebands add exactly 50% extra power." },
        { type: "NAT", difficulty: "Medium", q: "An FM system has Δf=75kHz, fm=15kHz. Find the bandwidth using Carson's rule.", answer: "180 kHz", solution: "BW = 2(Δf+fm) = 2(75+15) = 180kHz.", shortcut: "These exact numbers (Δf=75kHz, fm=15kHz) are the real commercial FM broadcast standard — recognizing this instantly tells you BW≈180-200kHz without recalculating from scratch." },
      ],
    },
    {
      topic: "Pulse Modulation (PCM)", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A 4kHz signal is sampled at the Nyquist rate and quantized with 8 bits/sample. Find the PCM bit rate.", answer: "64 kbps", solution: "fs(Nyquist)=8kHz. Bit rate = n×fs = 8×8000 = 64,000 bps = 64kbps.", shortcut: "This is exactly the standard telephony PCM rate (64kbps) — recognize it as a benchmark number to sanity-check similar problems." },
        { type: "NAT", difficulty: "Easy", q: "If quantization bits increase from 8 to 10, find the SNR improvement.", answer: "12 dB", solution: "ΔSNR ≈ 6×Δn dB = 6×2 = 12dB.", shortcut: "'6dB per bit' is a fixed rule — never derive the full SNR formula when only asked for the change due to added bits." },
      ],
    },
    {
      topic: "Information Theory", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A channel has B=3kHz, S/N=1000. Find the channel capacity.", answer: "≈ 29.9 kbps", solution: "C = B log₂(1+S/N) = 3000×log₂(1001) ≈ 3000×9.97 ≈ 29,900 bps.", shortcut: "log₂(1000)≈9.97 — memorize log₂(1000)≈10 as a fast mental estimate whenever S/N is given as a round power-of-10 number (not in dB)." },
        { type: "NAT", difficulty: "Easy", q: "A source has symbol probabilities 0.5, 0.25, 0.25. Find the entropy.", answer: "1.5 bits/symbol", solution: "H = −Σp log₂p = 0.5×1+0.25×2+0.25×2 = 0.5+0.5+0.5 = 1.5 bits/symbol.", shortcut: "For powers-of-2 probabilities (1/2, 1/4, 1/8...), log₂(1/p) is always a clean integer — pick those terms first; they need no calculator." },
      ],
    },
    {
      topic: "Digital Modulation", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Easy", q: "A 16-QAM system transmits at 2400 symbols/sec. Find the bit rate.", answer: "9600 bps", solution: "bits/symbol = log₂16 = 4. Bit rate = 4×2400 = 9600bps.", shortcut: "log₂(M) for M=2,4,8,16,32,64 → 1,2,3,4,5,6 — memorize this small table; M-ary bit-rate questions are pure lookup once you have it." },
        { type: "Conceptual", difficulty: "Medium", q: "Rank ASK, FSK, BPSK by noise immunity (best→worst) for equal average power.", answer: "BPSK > FSK > ASK", solution: "BPSK uses phase with coherent/matched-filter detection (best noise immunity). FSK is next. ASK (amplitude-only) is most vulnerable to noise/fading.", shortcut: "For qualitative BER-ranking MCQs, just remember the order BPSK>FSK>ASK — full derivation is rarely needed for these conceptual questions." },
      ],
    },
  ],

  control: [
    {
      topic: "Time Domain Analysis", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A 2nd order system has ζ=0.5, ωn=4 rad/s. Find peak overshoot Mp(%) and settling time (2%).", answer: "Mp≈16.3%, ts=2s", solution: "Mp=e^(−ζπ/√(1−ζ²))×100 = e^(−1.814)×100≈16.3%. ts=4/(ζωn)=4/(0.5×4)=2s.", shortcut: "For ζ=0.5 specifically, Mp≈16% is a benchmark value worth memorizing — instantly sanity-checks your calculator answer." },
        { type: "NAT", difficulty: "Easy", q: "A type-1 system has Kv=10. Find the steady-state error for a unit ramp input.", answer: "0.1", solution: "ess = 1/Kv = 1/10 = 0.1.", shortcut: "Match input type to error constant: step→Kp, ramp→Kv, parabolic→Ka. Get the type-input pairing right before plugging in any number." },
      ],
    },
    {
      topic: "Routh-Hurwitz", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "Find the range of K for stability: s³+3s²+3s+K=0.", answer: "0 < K < 9", solution: "Routh array: s³:[1,3], s²:[3,K], s¹:[(9−K)/3], s⁰:[K]. For stability all first-column entries >0: (9−K)/3>0 ⇒ K<9, and K>0.", shortcut: "For a 3rd-order Routh table, the stability condition almost always reduces to a single clean inequality from the s¹ row — compute that row first if you're short on time." },
        { type: "NAT", difficulty: "Hard", q: "How many roots of s⁴+2s³+3s²+4s+5=0 lie in the right-half plane?", answer: "2", solution: "Routh array first column: 1, 2, 1, −6, 5. Sign sequence +,+,+,−,+ → 2 sign changes → 2 roots in RHP.", shortcut: "Count sign changes in the first column only — each sign change = exactly one RHP root. Don't worry about the rest of the array once you have the first column." },
      ],
    },
    {
      topic: "Root Locus", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "G(s)H(s)=K/[s(s+2)(s+4)]. Find the number of asymptotes and their angles.", answer: "3 asymptotes at 60°, 180°, 300°", solution: "Asymptotes = poles−zeros = 3−0=3. Angles = (2k+1)180°/3 for k=0,1,2 → 60°,180°,300°.", shortcut: "Number of asymptotes always equals (poles − zeros) — compute this single number first, it instantly tells you how many angle values to find." },
        { type: "NAT", difficulty: "Medium", q: "For the same system, find the centroid of the asymptotes.", answer: "−2", solution: "Centroid = (Σpoles−Σzeros)/(P−Z) = (0−2−4−0)/3 = −2.", shortcut: "Centroid is always real (even though individual poles might be complex) — if your answer has an imaginary part, you've made an error." },
      ],
    },
    {
      topic: "Frequency Domain (Bode/Nyquist)", freq: "High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "G(s)=10/[s(s+1)]. At the gain crossover frequency, phase=−135°. Find the phase margin.", answer: "45°", solution: "PM = 180° + phase(at gain crossover) = 180+(−135) = 45°.", shortcut: "PM=180+phase is a one-line formula — never re-derive it from the Nyquist plot geometry unless explicitly asked to sketch." },
        { type: "Conceptual", difficulty: "Easy", q: "G(s)H(s) has 2 poles at the origin. What is the initial slope of the Bode magnitude plot?", answer: "−40 dB/decade", solution: "Each pole at the origin contributes −20dB/decade from the start of the plot. Two poles → −40dB/decade initial slope.", shortcut: "Initial Bode slope = −20×(number of poles at origin) + 20×(number of zeros at origin), in dB/decade — read this directly off the TF without plotting anything." },
      ],
    },
  ],

  em: [
    {
      topic: "Transmission Lines", freq: "Very High",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A line with Z0=50Ω is terminated in ZL=150Ω. Find Γ and VSWR.", answer: "Γ=0.5, VSWR=3", solution: "Γ=(150−50)/(150+50)=100/200=0.5. VSWR=(1+0.5)/(1−0.5)=1.5/0.5=3.", shortcut: "If ZL>Z0, Γ is positive and VSWR=ZL/Z0 directly (when purely resistive) — here 150/50=3, matching instantly without computing Γ first." },
        { type: "NAT", difficulty: "Medium", q: "A quarter-wave transformer matches a 50Ω line to a 200Ω load. Find the matching section's characteristic impedance.", answer: "100 Ω", solution: "Z0(match) = √(Z0×ZL) = √(50×200) = √10000 = 100Ω.", shortcut: "Quarter-wave matching impedance is always the geometric mean of source and load impedance — memorize this single formula, it replaces the entire Smith-chart approach for this question type." },
      ],
    },
    {
      topic: "Maxwell's Equations", freq: "High",
      qs: [
        { type: "Conceptual", difficulty: "Medium", q: "Which Maxwell's equation introduces the concept of displacement current?", answer: "Modified Ampère's Law", solution: "∇×H = J + ∂D/∂t — the ∂D/∂t term is the displacement current density, added by Maxwell to fix Ampère's law for time-varying fields.", shortcut: "Whenever a question mentions 'displacement current', the answer is always tied to Ampère's law modification — don't search the other three equations." },
        { type: "Conceptual", difficulty: "Easy", q: "At a boundary between two dielectrics (no surface current), which field component is continuous tangentially?", answer: "Tangential E (and tangential H)", solution: "Boundary conditions: tangential E is continuous; normal D is continuous if no surface charge; tangential H continuous if no surface current; normal B always continuous.", shortcut: "Memorize as pairs: tangential-E/H continuous (unless surface current breaks H), normal-D/B continuous (unless surface charge breaks D) — most boundary-condition MCQs test exactly this pairing." },
      ],
    },
    {
      topic: "Waveguides", freq: "Medium",
      qs: [
        { type: "NAT", difficulty: "Medium", q: "A rectangular waveguide has broad dimension a=2cm. Find the TE10 cutoff frequency.", answer: "7.5 GHz", solution: "fc = c/2a = (3×10⁸)/(2×0.02) = 7.5×10⁹ Hz = 7.5GHz.", shortcut: "TE10 cutoff depends ONLY on dimension 'a' — ignore the 'b' dimension entirely for this specific (most commonly asked) mode." },
        { type: "NAT", difficulty: "Hard", q: "For the same waveguide operating at 10GHz, find the guide wavelength λg.", answer: "≈ 4.54 cm", solution: "λ0=c/f=3cm. fc/f=7.5/10=0.75. λg=λ0/√(1−(fc/f)²)=3/√(1−0.5625)=3/0.661≈4.54cm.", shortcut: "Guide wavelength is always longer than free-space wavelength (λg>λ0) — if your computed answer comes out shorter, you've made a sign error in the square root." },
      ],
    },
  ],
};

const PYQ_SUBJECT_META = {
  maths: { name: "Engineering Mathematics", icon: Cpu },
  ga: { name: "General Aptitude", icon: Target },
  networks: { name: "Network Theory", icon: Zap },
  signals: { name: "Signals & Systems", icon: Activity },
  digital: { name: "Digital Circuits", icon: Layers },
  analog: { name: "Analog Circuits", icon: Radio },
  edc: { name: "Electronic Devices", icon: Cpu },
  comm: { name: "Communication Systems", icon: Radio },
  control: { name: "Control Systems", icon: TrendingUp },
  em: { name: "Electromagnetics", icon: Zap },
};

const freqColor = { "Very High": "#E8704D", "High": "#E8A33D", "Medium": "#4FD8C4" };

const phases = [
  { n: "01", name: "Foundation", dates: "18 Jun – 31 Aug", weeks: "~10.5 wks", focus: "Eng. Maths, Network Theory, EDC, Signals & Systems (basic), Digital Circuits", deliverable: "All Tier-1 topics of these 5 subjects + 10-yr chapter-wise PYQs done" },
  { n: "02", name: "Core Mastery", dates: "1 Sep – 31 Oct", weeks: "~8.5 wks", focus: "Analog Circuits, Control Systems, Communications, EM Theory", deliverable: "First pass complete on all subjects; Tier-1+2 covered" },
  { n: "03", name: "Integration & PYQ Intensive", dates: "1 Nov – 15 Dec", weeks: "~6.5 wks", focus: "Subject-wise PYQs (20 yrs, all subjects), mixed sets, sectional mocks begin", deliverable: "100% of last 20-yr PYQs attempted once; error notebook v1 ready" },
  { n: "04", name: "Mock Test Phase", dates: "16 Dec – 15 Jan", weeks: "~4.5 wks", focus: "Full mocks 2–3/week, deep error analysis, weak-area drilling", deliverable: "12–15 full mocks done; weak topics re-mastered" },
  { n: "05", name: "Final Sprint", dates: "16 Jan – 5 Feb", weeks: "~3 wks", focus: "Pure revision: formula sheets, one-pagers, error notebook, light mocks", deliverable: "Zero new topics — only repetition and speed-building" },
];

const top20Lists = [
  {
    title: "Easiest Scoring Topics",
    items: ["Number systems & codes", "Boolean algebra / K-map", "GA quant fundamentals", "GA verbal/grammar", "Network theorems (Thevenin/Norton)", "Op-amp basic configurations", "Diode I-V & applications", "Routh-Hurwitz stability", "Sampling theorem", "Shannon capacity formula", "PCM bit-rate numericals", "Flip-flop excitation tables", "Eigenvalues of matrices", "Bayes' theorem", "Steady-state error (control)", "Series/parallel resonance", "Mod-N counter design", "MOSFET region identification", "Quarter-wave transformer matching", "Entropy calculation"],
  },
  {
    title: "Highest-Weightage Topics",
    items: ["Comm. systems modulation (AM/FM/PCM)", "Digital design (combinational+sequential)", "Op-amp circuits", "BJT/MOSFET small-signal amplifiers", "Network theorems & transients", "LTI systems & convolution", "Laplace/Z-transform", "MOSFET/BJT device physics", "Routh-Hurwitz & root locus", "Bode plot/Nyquist", "Transmission line matching", "Linear algebra (eigenvalues)", "Probability distributions", "K-map minimization", "Sampling & PCM", "ADC/DAC", "Feedback amplifier topologies", "Fourier series/transform", "Maxwell's equations & boundary conditions", "GA quant + verbal combined"],
  },
  {
    title: "Most Repeated PYQ Concepts",
    items: ["Thevenin/Norton w/ dependent source", "RL/RC switching transient", "Eigenvalues of 2×2/3×3 matrix", "K-map with don't-cares", "Mod-N counter design", "Flip-flop conversion", "MOSFET ID in saturation", "BJT α-β relations", "Op-amp inverting/non-inv gain", "Barkhausen oscillator condition", "Convolution of two signals", "Pole-zero stability/causality", "Fourier series of periodic waveform", "Z-transform with ROC", "Sampling rate for bandlimited signal", "AM power/bandwidth", "FM Carson's rule bandwidth", "PCM SNR improvement", "Routh array special case", "Quarter-wave transformer/VSWR"],
  },
  {
    title: "Zero-Tolerance Must-Master List",
    items: ["Eigenvalues & matrix properties", "Probability distributions & Bayes", "Laplace & Z-transform (full mastery)", "Convolution & LTI properties", "Network theorems w/ dependent sources", "Two-port parameters", "K-map + sequential design", "MOSFET/BJT physics + small-signal", "Feedback amplifier analysis", "Op-amp applications", "Routh-Hurwitz + Root locus + Bode/Nyquist", "State-space representation", "AM/FM/PCM full numerical mastery", "Shannon capacity & entropy", "Digital modulation BER comparison", "Transmission line Zin/Γ/VSWR", "Maxwell's equations + boundary conditions", "Waveguide cutoff frequency", "GA quant + verbal (daily, till exam)", "Vector calculus"],
  },
];

const dailyChecklist = [
  "30–45 min GA practice (quant/verbal/reasoning) — no skipping",
  "Studied/revised 1 topic with full derivation, not just reading",
  "Solved PYQs on today's topic (untimed Phase 1–2, timed Phase 3–5)",
  "Updated Mistake Notebook with any new error",
  "Updated Formula Notebook with any new formula",
  "10–15 formula flashcards reviewed regardless of other study",
  "Checked spaced-repetition due list (1-day / 7-day / 30-day)",
  "If a mock/sectional test was taken, analyzed it within 24 hrs",
  "Reviewed PYQ tracker for 3+ error clustering on any topic",
  "Slept 7–8 hours",
  "No new topic started before yesterday's was once-revised",
  "Stayed on current Phase's plan — no premature mock/PYQ jump",
];

const weeklyChecklist = [
  "Sunday: full-week revision + 1 sectional/full test + notebook consolidation",
  "Reviewed weak-topic clustering from PYQ tracker, scheduled re-study if needed",
];

const monthlyChecklist = [
  "Full revision of the month's subjects (2 dedicated days)",
  "Formula notebook self-test (write blank, compare, fix gaps)",
  "Honest progress check against the Phase roadmap — recalibrate if behind",
];

const revisionRows = [
  { interval: "After 1 day", what: "Today's new topic", how: "Re-derive 2–3 key formulas from memory, redo 5 PYQs without notes" },
  { interval: "After 7 days", what: "That week's topics", how: "Full formula-sheet recall test — write blank, then check" },
  { interval: "After 30 days", what: "That month's subjects", how: "Mixed PYQ set (20–30 Qs) across the month's topics, timed" },
  { interval: "Monthly (rolling)", what: "All subjects so far", how: "1 sectional mock per subject covered + mistake-notebook review" },
  { interval: "Final (Phase 5)", what: "Entire syllabus", how: "2 subjects/day from one-pagers + formula notebook, full cycle every 4–5 days" },
];

const lastMile = [
  { label: "Last 90 days", sub: "≈ early Nov", text: "Finish all subjects' first pass completely. Begin subject-wise PYQ intensive. Start weekly full mocks. No subject left untouched." },
  { label: "Last 60 days", sub: "≈ early Dec", text: "All 20-year PYQs attempted at least once. Mock frequency → 2/week. Mistake notebook substantial — begin weekly clustering analysis." },
  { label: "Last 30 days", sub: "≈ early Jan", text: "Zero new topics. Pure mock + revision mode. Mocks 2–3/week with deep analysis. Formula notebook finalized into the Final Revision Notebook." },
  { label: "Last 15 days", sub: "", text: "Stop full mocks except 2–3 light confidence-builders. Daily rotation through one-pagers, full cycle every 4–5 days. Redo only previously wrong questions." },
  { label: "Last 7 days", sub: "", text: "Only Final Revision Notebook + flashcards. 1 light mock at most, early in the week. Sleep schedule matched to exam timing. No new learning." },
  { label: "Exam day", sub: "", text: "Light formula glance, not new study. First pass: sure-shot questions for a marks cushion. Second pass: 90-second decision rule. Final pass: all MSQ/NAT (no negative marking). Last 10 min: review marked answers only." },
];

const tierColor = { tier1: C.red, tier2: C.cyan, tier3: C.dim };
const tierLabel = { tier1: "T1 · MUST MASTER", tier2: "T2 · IMPORTANT", tier3: "T3 · LOW PRIORITY" };


/* ============================== SMALL COMPONENTS ============================== */

function TraceDivider() {
  return (
    <svg width="100%" height="14" viewBox="0 0 400 14" preserveAspectRatio="none" style={{ display: "block" }}>
      <line x1="0" y1="7" x2="400" y2="7" stroke={C.border} strokeWidth="1" />
      {[20, 100, 180, 260, 340].map((x, i) => (
        <circle key={i} cx={x} cy="7" r="2.5" fill={C.border} />
      ))}
    </svg>
  );
}

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="mb-8">
      <div
        className="text-xs tracking-widest font-bold mb-2"
        style={{ color: C.amber, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.18em" }}
      >
        {eyebrow}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {title}
      </h2>
      {sub && <p className="max-w-2xl" style={{ color: C.dim }}>{sub}</p>}
      <div className="mt-4"><TraceDivider /></div>
    </div>
  );
}

function TierBadge({ tier }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: tierColor[tier],
        border: `1px solid ${tierColor[tier]}55`,
        background: `${tierColor[tier]}14`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: tierColor[tier], display: "inline-block" }} />
      {tierLabel[tier]}
    </span>
  );
}

function SubjectCard({ s }) {
  const [open, setOpen] = useState(false);
  const Icon = s.icon;
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-4 md:px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div
            className="flex items-center justify-center rounded-md shrink-0"
            style={{ width: 40, height: 40, background: C.surface2, border: `1px solid ${C.border}`, color: C.cyan }}
          >
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs" style={{ color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>
                #{String(s.rank).padStart(2, "0")}
              </span>
              <h3 className="font-bold truncate" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                {s.name}
              </h3>
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: C.dim }}>{s.verdict}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-extrabold leading-none" style={{ color: C.amber, fontFamily: "'JetBrains Mono', monospace" }}>{s.marks}</div>
            <div className="text-[10px]" style={{ color: C.dim }}>MARKS</div>
          </div>
          {open ? <ChevronDown size={18} color={C.dim} /> : <ChevronRight size={18} color={C.dim} />}
        </div>
      </button>

      {open && (
        <div className="px-4 md:px-5 pb-5" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <div className="rounded-md p-3" style={{ background: C.surface2 }}>
              <TierBadge tier="tier1" />
              <ul className="mt-2 space-y-1.5">
                {s.tier1.map((t, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: C.text }}>• {t}</li>)}
              </ul>
            </div>
            <div className="rounded-md p-3" style={{ background: C.surface2 }}>
              <TierBadge tier="tier2" />
              <ul className="mt-2 space-y-1.5">
                {s.tier2.length ? s.tier2.map((t, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: C.text }}>• {t}</li>) : <li className="text-xs" style={{ color: C.dim }}>—</li>}
              </ul>
            </div>
            <div className="rounded-md p-3" style={{ background: C.surface2 }}>
              <TierBadge tier="tier3" />
              <ul className="mt-2 space-y-1.5">
                {s.tier3.length ? s.tier3.map((t, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: C.text }}>• {t}</li>) : <li className="text-xs" style={{ color: C.dim }}>—</li>}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div className="rounded-md p-3" style={{ background: C.surface2 }}>
              <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: C.cyan, fontFamily: "'JetBrains Mono', monospace" }}>
                <Lightbulb size={13} /> KEY CONCEPTS
              </div>
              <ul className="space-y-1">
                {s.concepts.map((c, i) => <li key={i} className="text-xs" style={{ color: C.dim }}>{i + 1}. {c}</li>)}
              </ul>
            </div>
            <div className="rounded-md p-3" style={{ background: C.surface2 }}>
              <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: C.cyan, fontFamily: "'JetBrains Mono', monospace" }}>
                <FileText size={13} /> FORMULA SHEET
              </div>
              <ul className="space-y-1.5">
                {s.formulas.map((f, i) => (
                  <li key={i} className="text-xs leading-relaxed" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <div className="rounded-md p-3" style={{ background: `${C.amber}0d`, border: `1px solid ${C.amber}33` }}>
              <div className="text-[11px] font-bold mb-1.5" style={{ color: C.amber, fontFamily: "'JetBrains Mono', monospace" }}>REPEATED PYQ PATTERNS</div>
              <p className="text-xs leading-relaxed" style={{ color: C.text }}>{s.patterns}</p>
            </div>
            <div className="rounded-md p-3" style={{ background: `${C.red}0d`, border: `1px solid ${C.red}33` }}>
              <div className="text-[11px] font-bold mb-1.5 flex items-center gap-1.5" style={{ color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                <AlertTriangle size={12} /> COMMON MISTAKES
              </div>
              <p className="text-xs leading-relaxed" style={{ color: C.text }}>{s.mistakes}</p>
            </div>
            <div className="rounded-md p-3" style={{ background: `${C.cyan}0d`, border: `1px solid ${C.cyan}33` }}>
              <div className="text-[11px] font-bold mb-1.5" style={{ color: C.cyan, fontFamily: "'JetBrains Mono', monospace" }}>SHORTCUTS & TRICKS</div>
              <p className="text-xs leading-relaxed" style={{ color: C.text }}>{s.shortcuts}</p>
            </div>
          </div>

          <div className="mt-3 text-xs" style={{ color: C.dim }}>
            <span className="font-bold" style={{ color: C.text }}>Study order: </span>{s.order}
          </div>
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const target = useMemo(() => new Date("2027-02-06T09:00:00+05:30").getTime(), []);
  const [left, setLeft] = useState(target - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const d = Math.max(0, Math.floor(left / 86400000));
  const h = Math.max(0, Math.floor((left % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((left % 3600000) / 60000));
  const sgn = Math.max(0, Math.floor((left % 60000) / 1000));

  const seg = (val, label) => (
    <div className="flex flex-col items-center">
      <div
        className="px-3 py-2 rounded text-2xl md:text-4xl font-extrabold tabular-nums"
        style={{
          color: C.amber,
          background: "#000",
          border: `1px solid ${C.border}`,
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: `0 0 12px ${C.amber}66`,
          minWidth: 64,
          textAlign: "center",
        }}
      >
        {String(val).padStart(2, "0")}
      </div>
      <div className="text-[10px] mt-1.5 tracking-widest" style={{ color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
    </div>
  );

  return (
    <div className="flex items-start gap-2 md:gap-3">
      {seg(d, "DAYS")}
      <div className="text-2xl md:text-4xl font-bold pt-1" style={{ color: C.border }}>:</div>
      {seg(h, "HRS")}
      <div className="text-2xl md:text-4xl font-bold pt-1" style={{ color: C.border }}>:</div>
      {seg(m, "MIN")}
      <div className="text-2xl md:text-4xl font-bold pt-1" style={{ color: C.border }}>:</div>
      {seg(sgn, "SEC")}
    </div>
  );
}

/* ============================== PYQ PRACTICE COMPONENT ============================== */

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function QuestionCard({ qq, qIndex, topicSlug }) {
  const [revealed, setRevealed] = useState(false);
  const typeColor = qq.type === "NAT" ? C.cyan : qq.type === "MCQ" ? C.amber : C.copper;
  const diffColor = qq.difficulty === "Easy" ? C.cyan : qq.difficulty === "Medium" ? C.amber : C.red;

  return (
    <div className="rounded-md p-3.5" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mono-font" style={{ color: typeColor, background: `${typeColor}14`, border: `1px solid ${typeColor}40` }}>{qq.type}</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mono-font" style={{ color: diffColor, background: `${diffColor}14`, border: `1px solid ${diffColor}40` }}>{qq.difficulty}</span>
        <span className="text-[10px] mono-font" style={{ color: C.dim }}>Q{qIndex + 1}</span>
      </div>

      <p className="text-sm leading-relaxed mb-2" style={{ color: C.text }}>{qq.q}</p>

      {qq.options && (
        <ul className="mb-2 space-y-1">
          {qq.options.map((o, i) => (
            <li key={i} className="text-xs flex gap-2" style={{ color: revealed && o === qq.answer ? C.cyan : C.dim }}>
              <span className="mono-font">{String.fromCharCode(65 + i)}.</span> {o}
              {revealed && o === qq.answer && <CheckCircle2 size={13} className="inline ml-1" />}
            </li>
          ))}
        </ul>
      )}

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs font-bold px-3 py-1.5 rounded mono-font mt-1"
          style={{ color: "#06120E", background: C.cyan }}
        >
          SHOW ANSWER & SHORTCUT
        </button>
      ) : (
        <div className="mt-2 space-y-2">
          <div className="rounded p-2.5" style={{ background: `${C.cyan}0d`, border: `1px solid ${C.cyan}33` }}>
            <div className="text-[10px] font-bold mono-font mb-1" style={{ color: C.cyan }}>ANSWER</div>
            <div className="text-sm font-semibold mono-font" style={{ color: C.text }}>{qq.answer}</div>
          </div>
          <div className="rounded p-2.5" style={{ background: C.surface }}>
            <div className="text-[10px] font-bold mono-font mb-1" style={{ color: C.dim }}>SOLUTION</div>
            <p className="text-xs leading-relaxed" style={{ color: C.text }}>{qq.solution}</p>
          </div>
          <div className="rounded p-2.5" style={{ background: `${C.amber}0d`, border: `1px solid ${C.amber}33` }}>
            <div className="text-[10px] font-bold mono-font mb-1 flex items-center gap-1.5" style={{ color: C.amber }}>
              <Lightbulb size={11} /> SHORTCUT
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.text }}>{qq.shortcut}</p>
          </div>
          <button onClick={() => setRevealed(false)} className="text-[11px] mono-font" style={{ color: C.dim }}>
            ↺ hide & re-attempt
          </button>
        </div>
      )}
    </div>
  );
}

function TopicBlock({ subjectId, block }) {
  const slug = slugify(block.topic);
  const storageKey = `pyq:${subjectId}:${slug}`;
  const [practiced, setPracticed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const res = raw ? { value: raw } : null;
        if (!cancelled) setPracticed(res ? res.value === "true" : false);
      } catch {
        if (!cancelled) setPracticed(false);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [storageKey]);

  const togglePracticed = async () => {
    const next = !practiced;
    setPracticed(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch { /* non-fatal */ }
  };

  return (
    <div className="rounded-lg p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <h4 className="font-bold mono-font text-sm" style={{ color: C.text }}>{block.topic}</h4>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded mono-font"
            style={{ color: freqColor[block.freq], background: `${freqColor[block.freq]}14`, border: `1px solid ${freqColor[block.freq]}40` }}
          >
            {block.freq.toUpperCase()} REPEAT
          </span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] mono-font" style={{ color: practiced ? C.cyan : C.dim }}>
          <input type="checkbox" checked={practiced} onChange={togglePracticed} disabled={!loaded} style={{ accentColor: C.cyan, width: 14, height: 14 }} />
          MARK TOPIC PRACTICED
        </label>
      </div>
      <div className="space-y-2.5">
        {block.qs.map((qq, i) => <QuestionCard key={i} qq={qq} qIndex={i} topicSlug={slug} />)}
      </div>
    </div>
  );
}

function PYQPractice() {
  const subjectIds = Object.keys(pyqBank);
  const [selected, setSelected] = useState(subjectIds[0]);
  const blocks = pyqBank[selected] || [];
  const totalQs = useMemo(
    () => Object.values(pyqBank).reduce((sum, topics) => sum + topics.reduce((s, t) => s + t.qs.length, 0), 0),
    []
  );

  return (
    <div>
      <SectionHeading
        eyebrow={`TEST BENCH · ${totalQs} ORIGINAL PRACTICE QUESTIONS`}
        title="PYQ practice, topic by topic"
        sub="Right after finishing a topic, jump here and drill it — no scrolling through 20 years of papers. Questions are written in GATE's exact style and difficulty, modeled on the most frequently recurring patterns, with full solutions and a shortcut for each."
      />

      <div className="rounded-md p-3 mb-6 text-xs leading-relaxed" style={{ background: `${C.amber}0d`, border: `1px solid ${C.amber}33`, color: C.text }}>
        <b style={{ color: C.amber }}>Note:</b> these are original questions written to match real GATE patterns and difficulty — not verbatim official papers. For exact official wording, pull from GOAPS archives, GATE Overflow's PYQ archive, or your Made&nbsp;Easy/ACE previous-year booklets.
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 tab-scroll">
        {subjectIds.map((id) => {
          const meta = PYQ_SUBJECT_META[id];
          const Icon = meta.icon;
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap text-xs font-semibold mono-font shrink-0"
              style={{
                color: active ? "#06120E" : C.dim,
                background: active ? C.amber : "transparent",
                border: `1px solid ${active ? C.amber : C.border}`,
              }}
            >
              <Icon size={13} /> {meta.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {blocks.map((block) => <TopicBlock key={block.topic} subjectId={selected} block={block} />)}
      </div>
    </div>
  );
}

/* ============================== AI TUTOR COMPONENT ============================== */

const getApiKey = () => localStorage.getItem("anthropic_api_key") || "";

async function callClaude(messages, pdfBase64 = null, systemPrompt = "", apiKey = "") {
  if (!apiKey) throw new Error("NO_KEY");
  const userMsg = messages[messages.length - 1];
  let body;

  if (pdfBase64 && messages.length === 1) {
    body = {
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
          { type: "text", text: userMsg.content },
        ],
      }],
    };
  } else if (pdfBase64) {
    const history = messages.slice(0, -1).map((m, i) => {
      if (i === 0 && m.role === "user") {
        return {
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: m.content },
          ],
        };
      }
      return m;
    });
    body = {
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMsg.content }],
    };
  } else {
    body = {
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map((b) => b.text || "").join("\n");
}

function MarkdownLite({ text }) {
  // Render basic markdown: **bold**, headings, bullet lists, code spans
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const inlinify = (s) => {
          const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
          return parts.map((p, j) => {
            if (p.startsWith("**") && p.endsWith("**"))
              return <b key={j} style={{ color: C.text }}>{p.slice(2, -2)}</b>;
            if (p.startsWith("`") && p.endsWith("`"))
              return <code key={j} className="px-1 rounded text-[11px] mono-font" style={{ background: C.surface2, color: C.cyan }}>{p.slice(1, -1)}</code>;
            return p;
          });
        };
        if (/^#{1,3}\s/.test(line)) {
          const level = line.match(/^#+/)[0].length;
          const txt = line.replace(/^#+\s/, "");
          return (
            <p key={i} className={`font-bold mono-font ${level === 1 ? "text-base" : "text-sm"}`} style={{ color: level === 1 ? C.amber : C.cyan }}>
              {txt}
            </p>
          );
        }
        if (/^[-•*]\s/.test(line))
          return <p key={i} className="text-sm leading-relaxed flex gap-2" style={{ color: C.text }}><span style={{ color: C.cyan }}>•</span><span>{inlinify(line.replace(/^[-•*]\s/, ""))}</span></p>;
        if (/^\d+\.\s/.test(line))
          return <p key={i} className="text-sm leading-relaxed" style={{ color: C.text }}>{inlinify(line)}</p>;
        return <p key={i} className="text-sm leading-relaxed" style={{ color: C.dim }}>{inlinify(line)}</p>;
      })}
    </div>
  );
}

function AITutor() {
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [activeMode, setActiveMode] = useState("learn");
  const [uploading, setUploading] = useState(false);
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [keyVisible, setKeyVisible] = useState(false);
  const [keySaved, setKeySaved] = useState(!!getApiKey());

  const saveKey = () => {
    localStorage.setItem("anthropic_api_key", apiKey.trim());
    setKeySaved(true);
  };

  // Learn mode
  const [learnOutput, setLearnOutput] = useState("");
  const [learnLoading, setLearnLoading] = useState(false);
  const [learnError, setLearnError] = useState("");

  // Chat mode
  const [chatHistory, setChatHistory] = useState([]); // [{role, content}]
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatEndRef = useRef(null);

  // Questions mode
  const [questions, setQuestions] = useState("");
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState("");
  const [qSubject, setQSubject] = useState("ECE");
  const [qCount, setQCount] = useState(5);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleUpload = (file) => {
    if (!file || file.type !== "application/pdf") return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setPdfBase64(base64);
      setPdfName(file.name);
      setUploading(false);
      setLearnOutput("");
      setChatHistory([]);
      setQuestions("");
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  const handleTeach = async () => {
    if (!pdfBase64) return;
    setLearnLoading(true);
    setLearnError("");
    setLearnOutput("");
    const prompt = `You are a GATE ECE expert tutor. I'm uploading my study notes PDF. 
Analyze and teach me everything in it by producing:

## 📌 TOPIC OVERVIEW
What subject/topics are covered in these notes.

## 🧠 KEY CONCEPTS (explained clearly)
List every important concept — explain each in 2-3 lines like you're teaching a student from scratch. Use simple language.

## 📐 FORMULAS & EQUATIONS
Extract every formula, write it clearly, and add a 1-line note on when to use it.

## ⚡ SHORTCUTS & TRICKS
Any patterns or shortcuts from the notes (or that apply to these concepts) useful for GATE.

## 🎯 WHAT TO REMEMBER FOR GATE
The 5-10 most critical points from this material that are highest priority for the exam.

Be thorough, structured, and GATE-focused throughout.`;
    try {
      const out = await callClaude([{ role: "user", content: prompt }], pdfBase64,
        "You are a world-class GATE ECE tutor. Be thorough, precise, and GATE-exam-focused.", apiKey);
      setLearnOutput(out);
    } catch (e) {
      setLearnError("Error: " + e.message);
    } finally {
      setLearnLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !pdfBase64) return;
    const userMsg = { role: "user", content: chatInput };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput("");
    setChatLoading(true);
    setChatError("");
    try {
      const reply = await callClaude(newHistory, pdfBase64,
        "You are a GATE ECE expert tutor. The student has uploaded their notes. Answer all questions clearly, concisely, and with GATE-exam context in mind. If asked about something in the notes, reference it directly.", apiKey);
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatError("Error: " + e.message);
      setChatHistory(newHistory);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!pdfBase64) return;
    setQLoading(true);
    setQError("");
    setQuestions("");
    const prompt = `You are a GATE ECE question setter. Based on the content of these notes, generate exactly ${qCount} GATE-style practice questions.

For EACH question provide:
**Q[N]. [The question — match real GATE difficulty and format: NAT/MCQ/Conceptual]**
Type: [NAT / MCQ / Conceptual]
Difficulty: [Easy / Medium / Hard]

[If MCQ: list 4 options as (A) (B) (C) (D)]

**Answer:** [exact answer]

**Solution:** [step-by-step worked solution]

**GATE Shortcut:** [the fastest way to solve this type in the exam]

---

Make questions directly based on concepts in these notes. Vary difficulty (mix of Easy/Medium/Hard). Focus on numericals where possible since GATE weights them heavily.`;
    try {
      const out = await callClaude([{ role: "user", content: prompt }], pdfBase64,
        "You are a world-class GATE ECE question setter. Generate precise, high-quality questions that match actual GATE exam patterns.", apiKey);
      setQuestions(out);
    } catch (e) {
      setQError("Error: " + e.message);
    } finally {
      setQLoading(false);
    }
  };

  const modes = [
    { id: "learn",     label: "Teach Me",          icon: BookMarked    },
    { id: "chat",      label: "Ask Questions",      icon: MessageSquare },
    { id: "questions", label: "Generate Questions", icon: Sparkles      },
  ];

  return (
    <div>
      <SectionHeading
        eyebrow="AI-POWERED · ANTHROPIC API"
        title="AI Notes Tutor"
        sub="Upload your PDF notes once — skip YouTube, skip re-reading. Get an instant teaching breakdown, ask anything about your notes, and generate practice questions from your own material."
      />

      {/* API Key Panel */}
      <div className="rounded-lg p-4 mb-5" style={{ background: C.surface, border: `1px solid ${keySaved ? C.cyan+"44" : C.amber+"66"}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <span className="text-xs mono-font font-bold" style={{ color: keySaved ? C.cyan : C.amber }}>
            {keySaved ? "✓ ANTHROPIC API KEY SAVED" : "⚠ ANTHROPIC API KEY REQUIRED FOR AI TUTOR"}
          </span>
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
            className="text-[11px] underline" style={{ color: C.dim }}>Get key from console.anthropic.com →</a>
        </div>
        <div className="flex gap-2">
          <input
            type={keyVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setKeySaved(false); }}
            placeholder="sk-ant-..."
            className="flex-1 px-3 py-2 rounded-md text-sm mono-font outline-none"
            style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
          />
          <button onClick={() => setKeyVisible(!keyVisible)} className="px-3 py-2 rounded-md text-xs mono-font" style={{ background: C.surface2, color: C.dim, border: `1px solid ${C.border}` }}>
            {keyVisible ? "HIDE" : "SHOW"}
          </button>
          <button onClick={saveKey} className="px-3 py-2 rounded-md text-xs font-bold mono-font" style={{ background: C.cyan, color: "#06120E" }}>
            SAVE
          </button>
        </div>
        <p className="text-[11px] mt-2" style={{ color: C.dim }}>
          Key is saved to your browser only — never sent anywhere except directly to api.anthropic.com. API usage will be billed to your Anthropic account (~$0.003 per session).
        </p>
      </div>

      {/* Upload zone */}
      <div
        className="rounded-xl p-6 mb-6 text-center"
        style={{ background: C.surface, border: `2px dashed ${pdfBase64 ? C.cyan : C.border}` }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); }}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: C.dim }}>
            <Loader2 size={18} className="animate-spin" /> Reading PDF…
          </div>
        ) : pdfBase64 ? (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: `${C.cyan}14`, border: `1px solid ${C.cyan}33` }}>
              <FileText size={16} color={C.cyan} />
              <span className="text-sm mono-font font-bold" style={{ color: C.cyan }}>{pdfName}</span>
            </div>
            <button
              onClick={() => { setPdfBase64(null); setPdfName(""); setLearnOutput(""); setChatHistory([]); setQuestions(""); }}
              className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md"
              style={{ color: C.dim, border: `1px solid ${C.border}` }}
            >
              <X size={13} /> Remove
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-3">
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: C.surface2, border: `1px solid ${C.border}` }}>
              <Upload size={24} color={C.dim} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: C.text }}>Drop your PDF notes here</p>
              <p className="text-xs mt-1" style={{ color: C.dim }}>or click to browse — any GATE subject, any format</p>
            </div>
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
          </label>
        )}
      </div>

      {!pdfBase64 && (
        <div className="rounded-lg p-4 text-center" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
          <p className="text-sm" style={{ color: C.dim }}>Upload your PDF notes above to unlock all three AI tutor modes ↑</p>
        </div>
      )}

      {pdfBase64 && (
        <>
          {/* Mode switcher */}
          <div className="flex gap-2 mb-6">
            {modes.map((m) => {
              const Icon = m.icon;
              const active = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold mono-font"
                  style={{
                    background: active ? C.cyan : C.surface,
                    color: active ? "#06120E" : C.dim,
                    border: `1px solid ${active ? C.cyan : C.border}`,
                  }}
                >
                  <Icon size={15} /> {m.label}
                </button>
              );
            })}
          </div>

          {/* ── LEARN MODE ── */}
          {activeMode === "learn" && (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-sm" style={{ color: C.dim }}>
                  Click below — AI will extract concepts, formulas, shortcuts and a GATE-priority summary from your notes.
                </p>
                <button
                  onClick={handleTeach}
                  disabled={learnLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold mono-font"
                  style={{ background: learnLoading ? C.surface2 : C.amber, color: learnLoading ? C.dim : "#06120E", border: `1px solid ${learnLoading ? C.border : C.amber}` }}
                >
                  {learnLoading ? <><Loader2 size={15} className="animate-spin" /> Teaching…</> : <><BookMarked size={15} /> Teach Me This</>}
                </button>
              </div>
      {learnError && learnError.includes("NO_KEY") && <p className="text-sm mb-3" style={{ color: C.red }}>⚠ Please save your Anthropic API key above first.</p>}
              {learnError && !learnError.includes("NO_KEY") && <p className="text-sm mb-3" style={{ color: C.red }}>{learnError}</p>}
              {learnOutput && (
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <MarkdownLite text={learnOutput} />
                </div>
              )}
              {!learnOutput && !learnLoading && (
                <div className="rounded-lg p-8 text-center" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
                  <Bot size={32} color={C.dim} className="mx-auto mb-3" />
                  <p className="text-sm" style={{ color: C.dim }}>Your personalized teaching summary will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* ── CHAT MODE ── */}
          {activeMode === "chat" && (
            <div>
              <div
                className="rounded-lg p-4 mb-3 overflow-y-auto space-y-3"
                style={{ background: C.surface, border: `1px solid ${C.border}`, minHeight: 320, maxHeight: 480 }}
              >
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 gap-3">
                    <MessageSquare size={32} color={C.dim} />
                    <p className="text-sm text-center" style={{ color: C.dim }}>
                      Ask anything about your notes.<br />
                      <span className="text-xs">"Explain the derivation on page 3" · "What's the formula for Q-factor?" · "Summarise the key points"</span>
                    </p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[85%] rounded-xl px-4 py-3"
                      style={{
                        background: msg.role === "user" ? C.cyan : C.surface2,
                        color: msg.role === "user" ? "#06120E" : C.text,
                        borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      }}
                    >
                      {msg.role === "assistant"
                        ? <MarkdownLite text={msg.content} />
                        : <p className="text-sm font-medium">{msg.content}</p>
                      }
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: C.surface2 }}>
                      <Loader2 size={14} className="animate-spin" color={C.cyan} />
                      <span className="text-sm" style={{ color: C.dim }}>Thinking…</span>
                    </div>
                  </div>
                )}
                {chatError && <p className="text-xs" style={{ color: C.red }}>{chatError}</p>}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChat()}
                  placeholder="Ask anything about your notes…"
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  disabled={chatLoading}
                />
                <button
                  onClick={handleChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="flex items-center justify-center rounded-lg px-4"
                  style={{ background: chatLoading || !chatInput.trim() ? C.surface2 : C.cyan, color: "#06120E", width: 44 }}
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: C.dim }}>Press Enter to send · Your PDF is attached to every message so Claude always has full context</p>
            </div>
          )}

          {/* ── GENERATE QUESTIONS MODE ── */}
          {activeMode === "questions" && (
            <div>
              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs mono-font" style={{ color: C.dim }}>NUMBER OF QUESTIONS</label>
                  <select
                    value={qCount}
                    onChange={(e) => setQCount(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-md text-sm mono-font"
                    style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}
                  >
                    {[3, 5, 8, 10].map((n) => <option key={n} value={n}>{n} questions</option>)}
                  </select>
                </div>
                <button
                  onClick={handleGenerateQuestions}
                  disabled={qLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold mono-font"
                  style={{ background: qLoading ? C.surface2 : `linear-gradient(135deg, ${C.cyan}, #2ec8b5)`, color: qLoading ? C.dim : "#06120E", border: `1px solid ${qLoading ? C.border : C.cyan}` }}
                >
                  {qLoading ? <><Loader2 size={15} className="animate-spin" /> Generating…</> : <><Sparkles size={15} /> Generate from My Notes</>}
                </button>
              </div>
              {qError && <p className="text-sm mb-3" style={{ color: C.red }}>{qError}</p>}
              {questions ? (
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs mono-font font-bold" style={{ color: C.cyan }}>QUESTIONS FROM YOUR NOTES</span>
                    <button onClick={() => setQuestions("")} className="text-[11px] mono-font flex items-center gap-1" style={{ color: C.dim }}>
                      <X size={11} /> Clear
                    </button>
                  </div>
                  <MarkdownLite text={questions} />
                </div>
              ) : !qLoading && (
                <div className="rounded-lg p-8 text-center" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
                  <Sparkles size={32} color={C.dim} className="mx-auto mb-3" />
                  <p className="text-sm" style={{ color: C.dim }}>GATE-style questions generated directly from your notes — with full solutions and shortcuts — will appear here</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================== TABS CONFIG ============================== */

const TABS = [
  { id: "overview",  label: "Overview",       icon: Activity       },
  { id: "subjects",  label: "Subjects",        icon: Layers         },
  { id: "pyq",       label: "PYQ Practice",    icon: FileText       },
  { id: "tutor",     label: "AI Tutor",        icon: Bot            },
  { id: "roadmap",   label: "Roadmap",         icon: Calendar       },
  { id: "toplists",  label: "Top-20 Lists",    icon: Award          },
  { id: "methods",   label: "Topper Methods",  icon: BookOpen       },
  { id: "revision",  label: "Revision System", icon: Repeat         },
  { id: "lastmile",  label: "Last-Mile Plan",  icon: Clock          },
  { id: "checklist", label: "Daily Checklist", icon: ListChecks     },
  { id: "progress",  label: "Progress Tracker",icon: Gauge          },
];

/* ============================== STORAGE HELPERS ============================== */

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const lastNDates = (n) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return out;
};

const MASTERY_STATES = ["not-started", "in-progress", "mastered"];
const MASTERY_META = {
  "not-started": { label: "Not started", color: "#87998F" },
  "in-progress": { label: "In progress", color: "#E8A33D" },
  "mastered": { label: "Mastered", color: "#4FD8C4" },
};

/* ============================== MAIN APP ============================== */

export default function App() {
  const [tab, setTab] = useState("overview");
  const [checked, setChecked] = useState(() => Array(dailyChecklist.length).fill(false));
  const [wChecked, setWChecked] = useState(() => Array(weeklyChecklist.length).fill(false));
  const [mChecked, setMChecked] = useState(() => Array(monthlyChecklist.length).fill(false));

  // ---- Progress Tracker state (persisted via localStorage) ----
  const [subjectStatus, setSubjectStatus] = useState({});
  const [dailyHistory, setDailyHistory] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load persisted data on mount — 3 batched reads total
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [masteryRes, historyRes] = await Promise.all([
          Promise.resolve({ value: localStorage.getItem("subjectMastery") }),
          Promise.resolve({ value: localStorage.getItem("dailyHistory") }),
        ]);
        if (cancelled) return;

        const mastery = masteryRes ? JSON.parse(masteryRes.value) : {};
        setSubjectStatus(mastery);

        const history = historyRes ? JSON.parse(historyRes.value) : {};
        setDailyHistory(history);
        const todayRec = history[todayKey()];
        if (todayRec && Array.isArray(todayRec.checked)) setChecked(todayRec.checked);

        setStorageReady(true);
      } catch {
        setStorageError(true);
        setStorageReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const persistDaily = async (nextChecked) => {
    const nextHistory = { ...dailyHistory, [todayKey()]: { checked: nextChecked, total: dailyChecklist.length } };
    setSaving(true);
    try {
      localStorage.setItem("dailyHistory", JSON.stringify(nextHistory));
      setDailyHistory(nextHistory);
    } catch {
      setStorageError(true);
    } finally {
      setSaving(false);
    }
  };

  const cycleMastery = async (subjectId) => {
    const current = subjectStatus[subjectId] || "not-started";
    const next = MASTERY_STATES[(MASTERY_STATES.indexOf(current) + 1) % MASTERY_STATES.length];
    const nextStatus = { ...subjectStatus, [subjectId]: next };
    setSubjectStatus(nextStatus);
    try {
      localStorage.setItem("subjectMastery", JSON.stringify(nextStatus));
    } catch {
      setStorageError(true);
    }
  };

  const toggle = (arr, setArr, i) => {
    const next = [...arr];
    next[i] = !next[i];
    setArr(next);
    if (arr === checked) persistDaily(next);
  };

  const doneCount = checked.filter(Boolean).length;
  const progress = Math.round((doneCount / dailyChecklist.length) * 100);

  // ---- Derived progress-tracker metrics ----
  const last30 = lastNDates(30);
  const streak = useMemo(() => {
    let s = 0;
    for (let i = last30.length - 1; i >= 0; i--) {
      const dk = last30[i];
      const rec = dk === todayKey() ? { checked, total: dailyChecklist.length } : dailyHistory[dk];
      if (!rec) { if (dk === todayKey()) continue; break; }
      const pct = (rec.checked.filter(Boolean).length / rec.total) * 100;
      if (pct >= 80) s++;
      else if (dk === todayKey()) continue;
      else break;
    }
    return s;
  }, [dailyHistory, checked, last30]);

  const masteredCount = Object.values(subjectStatus).filter((v) => v === "mastered").length;
  const inProgressCount = Object.values(subjectStatus).filter((v) => v === "in-progress").length;
  const totalPyqCount = useMemo(
    () => Object.values(pyqBank).reduce((sum, topics) => sum + topics.reduce((s, t) => s + t.qs.length, 0), 0),
    []
  );
  const syllabusPct = Math.round(((masteredCount + inProgressCount * 0.5) / subjects.length) * 100);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.cyan}55; }
        .body-font { font-family: 'Inter', sans-serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${C.cyan}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
        .tab-scroll::-webkit-scrollbar { height: 4px; }
        .tab-scroll::-webkit-scrollbar-thumb { background: ${C.border}; }
      `}</style>

      <div className="body-font">
        {/* ===== HEADER / NAV ===== */}
        <header className="sticky top-0 z-30" style={{ background: `${C.bg}f2`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}` }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center rounded" style={{ width: 30, height: 30, background: C.surface2, border: `1px solid ${C.border}`, color: C.cyan }}>
                  <Cpu size={16} />
                </div>
                <div className="mono-font font-extrabold text-sm tracking-wide" style={{ color: C.text }}>
                  GATE-ECE-2027<span style={{ color: C.amber }}>//</span>AIR&lt;100
                </div>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-[11px] mono-font" style={{ color: C.dim }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: C.cyan, display: "inline-block" }} />
                LIVE BLUEPRINT
              </div>
            </div>
            <nav className="tab-scroll flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap text-xs font-semibold mono-font shrink-0"
                    style={{
                      color: active ? "#06120E" : C.dim,
                      background: active ? C.cyan : "transparent",
                      border: `1px solid ${active ? C.cyan : C.border}`,
                    }}
                  >
                    <Icon size={13} /> {t.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

          {/* ===== OVERVIEW ===== */}
          {tab === "overview" && (
            <div>
              <div className="grid lg:grid-cols-[1.3fr,1fr] gap-8 items-start">
                <div>
                  <div className="text-xs tracking-widest font-bold mb-3 mono-font" style={{ color: C.amber, letterSpacing: "0.2em" }}>
                    PREPARATION DATASHEET · REV 2027
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 mono-font">
                    Target: <span style={{ color: C.cyan }}>AIR &lt; 100</span><br />Build: <span style={{ color: C.amber }}>GATE ECE 2027</span>
                  </h1>
                  <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: C.dim, maxWidth: 520 }}>
                    A complete signal path from where you stand today to exam day — every subject ranked,
                    tiered, formula-mapped and PYQ-pattern-mined from two decades of papers, wired into a
                    week-by-week roadmap and a daily execution checklist.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setTab("subjects")} className="px-4 py-2 rounded-md text-xs font-bold mono-font" style={{ background: C.cyan, color: "#06120E" }}>
                      VIEW SUBJECTS →
                    </button>
                    <button onClick={() => setTab("checklist")} className="px-4 py-2 rounded-md text-xs font-bold mono-font" style={{ border: `1px solid ${C.border}`, color: C.text }}>
                      OPEN DAILY CHECKLIST
                    </button>
                  </div>
                </div>

                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="text-[10px] tracking-widest font-bold mb-3 mono-font" style={{ color: C.dim }}>T-MINUS TO GATE 2027 (EST.)</div>
                  <Countdown />
                  <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="text-[10px] tracking-widest font-bold mb-2 mono-font" style={{ color: C.dim }}>EXAM SPEC</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div style={{ color: C.dim }}>Conducting IIT</div><div className="text-right mono-font">IIT Madras (exp.)</div>
                      <div style={{ color: C.dim }}>Pattern</div><div className="text-right mono-font">100 marks / 3 hrs</div>
                      <div style={{ color: C.dim }}>Question types</div><div className="text-right mono-font">MCQ · MSQ · NAT</div>
                      <div style={{ color: C.dim }}>GA weight</div><div className="text-right mono-font">15%</div>
                      <div style={{ color: C.dim }}>Maths weight</div><div className="text-right mono-font">13%</div>
                      <div style={{ color: C.dim }}>Core ECE weight</div><div className="text-right mono-font">72%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-14">
                <SectionHeading eyebrow="SIGNAL ANALYSIS" title="Subject-wise weightage (marks / 100)" sub="Approximate marks distribution based on consistent trends across the last ~20 years of GATE ECE papers." />
                <div className="rounded-lg p-4 md:p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={[...weightageData].sort((a, b) => b.marks - a.marks)} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                      <XAxis type="number" stroke={C.dim} tick={{ fill: C.dim, fontSize: 11 }} domain={[0, 16]} />
                      <YAxis type="category" dataKey="name" stroke={C.dim} tick={{ fill: C.text, fontSize: 12 }} width={90} />
                      <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text }} cursor={{ fill: `${C.cyan}11` }} />
                      <Bar dataKey="marks" radius={[0, 4, 4, 0]}>
                        {weightageData.sort((a, b) => b.marks - a.marks).map((entry, i) => (
                          <Cell key={i} fill={i < 3 ? C.amber : C.cyan} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-14">
                <SectionHeading eyebrow="PRIORITY MAP" title="Study sequence logic" sub="Not exam-day order — this is the order to build mastery in, so each subject's foundation supports the next." />
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <div className="px-3 py-2 rounded-md text-xs mono-font font-semibold flex items-center gap-1.5" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
                        <span style={{ color: C.amber }}>{String(i + 1).padStart(2, "0")}</span> {s.name}
                      </div>
                      {i < subjects.length - 1 && <span style={{ color: C.border, alignSelf: "center" }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== SUBJECTS ===== */}
          {tab === "subjects" && (
            <div>
              <SectionHeading eyebrow="COMPONENT LIBRARY" title="Subject-wise deep dive" sub="Tap a subject to expand its full datasheet — tiers, key concepts, formulas, repeated PYQ patterns, mistakes and shortcuts." />
              <div className="space-y-3">
                {subjects.map((s) => <SubjectCard key={s.id} s={s} />)}
              </div>
            </div>
          )}

          {/* ===== PYQ PRACTICE ===== */}
          {tab === "pyq" && <PYQPractice />}

          {/* ===== AI TUTOR ===== */}
          {tab === "tutor" && <AITutor />}

          {/* ===== ROADMAP ===== */}
          {tab === "roadmap" && (
            <div>
              <SectionHeading eyebrow="SIGNAL PATH" title="Complete roadmap to GATE 2027" sub="Five phases from today to exam day. Each phase has a hard deliverable — don't advance until it's met." />
              <div className="relative pl-6 md:pl-10">
                <div className="absolute left-[9px] md:left-[13px] top-2 bottom-2 w-px" style={{ background: C.border }} />
                <div className="space-y-6">
                  {phases.map((p) => (
                    <div key={p.n} className="relative">
                      <div className="absolute -left-6 md:-left-10 top-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.bg, border: `2px solid ${C.cyan}` }}>
                        <span style={{ width: 6, height: 6, borderRadius: 999, background: C.cyan, display: "inline-block" }} />
                      </div>
                      <div className="rounded-lg p-4 md:p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                          <span className="mono-font text-xs font-bold" style={{ color: C.amber }}>PHASE {p.n}</span>
                          <h3 className="font-bold mono-font" style={{ color: C.text }}>{p.name}</h3>
                          <span className="text-xs" style={{ color: C.dim }}>{p.dates} · {p.weeks}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: C.text }}>{p.focus}</p>
                        <div className="text-xs rounded px-2.5 py-1.5 inline-block" style={{ background: `${C.cyan}14`, color: C.cyan, border: `1px solid ${C.cyan}33` }}>
                          ✓ Deliverable: {p.deliverable}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 grid md:grid-cols-2 gap-4">
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="mono-font font-bold mb-3" style={{ color: C.cyan }}>Mock test schedule</h3>
                  <ul className="text-sm space-y-2" style={{ color: C.text }}>
                    <li>• Sectional/topic tests from Phase 1 (1 per topic post-completion)</li>
                    <li>• Subject-wise full tests from Phase 2 end</li>
                    <li>• Full-length mocks: 1/week (Phase 3) → 2–3/week (Phase 4) → 2/week light (Phase 5)</li>
                    <li>• Target: <span style={{ color: C.amber }}>25–30 full mocks</span> by exam day</li>
                  </ul>
                </div>
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="mono-font font-bold mb-3" style={{ color: C.cyan }}>PYQ schedule</h3>
                  <ul className="text-sm space-y-2" style={{ color: C.text }}>
                    <li>• Phase 1–2: chapter-wise PYQs right after each topic (10 yrs first)</li>
                    <li>• Phase 3: subject-wise PYQs, full 20-year set, timed</li>
                    <li>• Phase 3 end–4: mixed/random cross-subject sets</li>
                    <li>• Phase 4–5: re-attempt only previously wrong/marked PYQs</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ===== TOP 20 LISTS ===== */}
          {tab === "toplists" && (
            <div>
              <SectionHeading eyebrow="CROSS-SUBJECT INDEX" title="Top-20 lists" sub="Four lenses on the same syllabus — what's easy, what's heavy, what repeats, and what's non-negotiable." />
              <div className="grid md:grid-cols-2 gap-4">
                {top20Lists.map((list) => (
                  <div key={list.title} className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <h3 className="mono-font font-bold mb-3 text-sm" style={{ color: C.amber }}>{list.title}</h3>
                    <ol className="space-y-1.5">
                      {list.items.map((it, i) => (
                        <li key={i} className="text-xs flex gap-2" style={{ color: C.text }}>
                          <span className="mono-font shrink-0" style={{ color: C.dim }}>{String(i + 1).padStart(2, "0")}</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== METHODS ===== */}
          {tab === "methods" && (
            <div>
              <SectionHeading eyebrow="TOPPER METHODOLOGY" title="Methods proven by AIR-1 to AIR-50 rankers" sub="Not generic advice — the specific habits that separate top scores from average ones." />
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { t: "Note-making", d: "One A5/A6 'flow notebook' per subject — formulas + 1-line concept triggers only, never textbook paragraphs. Rewrite once mid-prep (Phase 3); the rewriting IS the revision." },
                  { t: "Revision strategy", d: "Spaced repetition, not linear re-reading. Revise from your own notes/formula sheet in later phases — textbooks are for first-pass learning only." },
                  { t: "Formula memorization", d: "Derive once, write 5× by hand, then test blank weekly. Group formulas by 'families' (e.g. all transform pairs together) rather than isolated memorization." },
                  { t: "PYQ practice (2-pass method)", d: "Attempt untimed → mark Correct/Wrong/Guessed/Skipped → redo wrong+guessed after 2 days without solutions → check solution only if still stuck." },
                  { t: "Mock test analysis", d: "Spend 2× the time analyzing as taking. Classify every error: concept gap, calculation error, misread, time pressure, or wrong guess. Track trend across mocks." },
                  { t: "Error tracking", d: "One running Mistake Notebook — topic, what went wrong, correct approach, date. Weekly review without skipping. The single highest-leverage habit among top rankers." },
                  { t: "Time management", d: "1-mark Qs first when spotted quickly. 90-second decision rule for 2-mark Qs — no approach in sight, mark and move on. Never >3 min on one question, first pass." },
                  { t: "Guessing strategy", d: "Never blind-guess negative-marked MCQs unless ≥2 of 4 options eliminated. Always attempt MSQ/NAT fully — zero negative marking, free attempts." },
                  { t: "Exam temperament", d: "Drill 'skip and return' in every mock until automatic. Fast first pass across the whole paper for sure-shot questions before tackling anything moderately hard." },
                ].map((m) => (
                  <div key={m.t} className="rounded-lg p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <h3 className="mono-font font-bold text-sm mb-1.5" style={{ color: C.cyan }}>{m.t}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: C.dim }}>{m.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <SectionHeading eyebrow="ARCHIVE STRUCTURE" title="Short-notes framework" />
                <div className="grid md:grid-cols-5 gap-3">
                  {[
                    { n: "One-Pagers", d: "1 page/subject — Tier-1 formulas + trickiest concepts. Built at end of each subject's first pass." },
                    { n: "Formula Notebook", d: "All formulas, subject→topic organized. Pocket-size, carried everywhere, built continuously." },
                    { n: "Mistake Notebook", d: "Every error, root cause, correction. Chronological + topic-tagged. Built from day 1." },
                    { n: "PYQ Concept Notebook", d: "Recurring question templates per topic, e.g. 'Thevenin w/ dependent source → template'." },
                    { n: "Final Revision Notebook", d: "Merged best-of all above. ~20–30 pages total, built in Phase 4–5." },
                  ].map((n) => (
                    <div key={n.n} className="rounded-lg p-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <h4 className="mono-font font-bold text-xs mb-1.5" style={{ color: C.amber }}>{n.n}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: C.dim }}>{n.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== REVISION SYSTEM ===== */}
          {tab === "revision" && (
            <div>
              <SectionHeading eyebrow="FEEDBACK LOOP" title="Spaced-repetition revision system" sub="The interval schedule that keeps every topic alive in memory through exam day." />
              <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: C.surface2 }}>
                      <th className="text-left p-3 mono-font text-xs" style={{ color: C.amber }}>INTERVAL</th>
                      <th className="text-left p-3 mono-font text-xs" style={{ color: C.amber }}>WHAT TO REVISE</th>
                      <th className="text-left p-3 mono-font text-xs" style={{ color: C.amber }}>HOW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revisionRows.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? C.surface : C.bg, borderTop: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold mono-font text-xs whitespace-nowrap" style={{ color: C.cyan }}>{r.interval}</td>
                        <td className="p-3 text-xs" style={{ color: C.text }}>{r.what}</td>
                        <td className="p-3 text-xs" style={{ color: C.dim }}>{r.how}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 grid md:grid-cols-2 gap-4">
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="mono-font font-bold mb-2 text-sm" style={{ color: C.amber }}>Formula mastery system</h3>
                  <ul className="text-xs space-y-2" style={{ color: C.text }}>
                    <li><b style={{ color: C.cyan }}>Schedule:</b> Daily 15-min blank-recall test from Phase 2 onward.</li>
                    <li><b style={{ color: C.cyan }}>Technique:</b> Group by "families"; derive once by hand before memorizing.</li>
                    <li><b style={{ color: C.cyan }}>Testing:</b> Weekly — write a subject's full sheet blank, mark gaps red, fix only those.</li>
                    <li><b style={{ color: C.cyan }}>Flashcards:</b> Top-20 highest-weightage formulas reviewed daily, Phase 4–5 without exception.</li>
                  </ul>
                </div>
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="mono-font font-bold mb-2 text-sm" style={{ color: C.amber }}>PYQ error analysis method</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.text }}>
                    Weekly: filter tracker by Wrong + Guessed → group by topic → if 3+ errors cluster in one topic,
                    that topic gets a dedicated 2-hour re-study session before moving forward, even if it delays the
                    schedule. Never let a clustering error go unaddressed — this is the #1 reason candidates plateau
                    at AIR 500–2000 instead of breaking into AIR&lt;100.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===== LAST MILE ===== */}
          {tab === "lastmile" && (
            <div>
              <SectionHeading eyebrow="FINAL APPROACH" title="Last-mile strategy" sub="What changes — and what stops — as exam day approaches." />
              <div className="space-y-3">
                {lastMile.map((l) => (
                  <div key={l.label} className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="sm:w-40 shrink-0">
                      <div className="mono-font font-bold text-sm" style={{ color: C.amber }}>{l.label}</div>
                      {l.sub && <div className="text-[11px]" style={{ color: C.dim }}>{l.sub}</div>}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.text }}>{l.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-lg p-5" style={{ background: `${C.red}0d`, border: `1px solid ${C.red}33` }}>
                <h3 className="mono-font font-bold mb-2 text-sm flex items-center gap-2" style={{ color: C.red }}>
                  <AlertTriangle size={15} /> What to avoid
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.text }}>
                  Over-investing in Tier-3 low-ROI topics (full Smith chart mastery, 3-phase circuits, IC fabrication
                  details) at the cost of Tier-1 revision time · switching study sources repeatedly · solving brand-new
                  PYQ sets in the last 7 days instead of revising known material.
                </p>
              </div>
            </div>
          )}

          {/* ===== CHECKLIST ===== */}
          {tab === "checklist" && (
            <div>
              <SectionHeading eyebrow="DAILY EXECUTION" title="AIR-1 Master Checklist" sub="Check items off as you complete them today. This resets when you reload — copy it to your own tracker for permanent use." />

              <div className="rounded-lg p-4 mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs mono-font" style={{ color: C.dim }}>TODAY'S PROGRESS</span>
                  <span className="text-xs mono-font font-bold flex items-center gap-2" style={{ color: C.cyan }}>
                    {saving && <Loader2 size={12} className="animate-spin" />}
                    {doneCount}/{dailyChecklist.length} · {progress}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: C.cyan, transition: "width .3s" }} />
                </div>
                <p className="text-[11px] mt-2" style={{ color: C.dim }}>
                  {storageError
                    ? "Saved on this device only — sync unavailable right now."
                    : "Auto-saved to your account — see it build a streak in Progress Tracker →"}
                </p>
              </div>

              <div className="rounded-lg p-5 mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <h3 className="mono-font font-bold text-sm mb-3" style={{ color: C.amber }}>DAILY</h3>
                <div className="space-y-2">
                  {dailyChecklist.map((item, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked[i]}
                        onChange={() => toggle(checked, setChecked, i)}
                        className="mt-0.5 shrink-0"
                        style={{ accentColor: C.cyan, width: 16, height: 16 }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: checked[i] ? C.dim : C.text, textDecoration: checked[i] ? "line-through" : "none" }}
                      >
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="mono-font font-bold text-sm mb-3" style={{ color: C.cyan }}>WEEKLY ADD-ON</h3>
                  <div className="space-y-2">
                    {weeklyChecklist.map((item, i) => (
                      <label key={i} className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={wChecked[i]} onChange={() => toggle(wChecked, setWChecked, i)} className="mt-0.5 shrink-0" style={{ accentColor: C.cyan, width: 16, height: 16 }} />
                        <span className="text-sm leading-relaxed" style={{ color: wChecked[i] ? C.dim : C.text, textDecoration: wChecked[i] ? "line-through" : "none" }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="mono-font font-bold text-sm mb-3" style={{ color: C.copper }}>MONTHLY ADD-ON</h3>
                  <div className="space-y-2">
                    {monthlyChecklist.map((item, i) => (
                      <label key={i} className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={mChecked[i]} onChange={() => toggle(mChecked, setMChecked, i)} className="mt-0.5 shrink-0" style={{ accentColor: C.copper, width: 16, height: 16 }} />
                        <span className="text-sm leading-relaxed" style={{ color: mChecked[i] ? C.dim : C.text, textDecoration: mChecked[i] ? "line-through" : "none" }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== PROGRESS TRACKER ===== */}
          {tab === "progress" && (
            <div>
              <SectionHeading
                eyebrow="TEST BENCH · PERSISTS ACROSS SESSIONS"
                title="Progress tracker"
                sub="Your daily checklist history and subject mastery status, saved to your account so it's still here tomorrow."
              />

              {!storageReady && (
                <div className="flex items-center gap-2 text-sm py-8 justify-center" style={{ color: C.dim }}>
                  <Loader2 size={16} className="animate-spin" /> Loading your saved progress…
                </div>
              )}

              {storageReady && (
                <>
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-lg p-5 flex items-center gap-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-center rounded-md shrink-0" style={{ width: 44, height: 44, background: `${C.amber}14`, color: C.amber }}>
                        <Flame size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold mono-font" style={{ color: C.amber }}>{streak} day{streak === 1 ? "" : "s"}</div>
                        <div className="text-[11px]" style={{ color: C.dim }}>current streak (≥80% daily checklist)</div>
                      </div>
                    </div>
                    <div className="rounded-lg p-5 flex items-center gap-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-center rounded-md shrink-0" style={{ width: 44, height: 44, background: `${C.cyan}14`, color: C.cyan }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold mono-font" style={{ color: C.cyan }}>{masteredCount}/{subjects.length}</div>
                        <div className="text-[11px]" style={{ color: C.dim }}>subjects marked mastered</div>
                      </div>
                    </div>
                    <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] mono-font" style={{ color: C.dim }}>SYLLABUS PROGRESS</span>
                        <span className="text-xs mono-font font-bold" style={{ color: C.text }}>{syllabusPct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                        <div className="h-full rounded-full" style={{ width: `${syllabusPct}%`, background: C.copper, transition: "width .3s" }} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg p-5 mb-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <h3 className="mono-font font-bold text-sm mb-1" style={{ color: C.amber }}>Last 30 days</h3>
                    <p className="text-xs mb-4" style={{ color: C.dim }}>Each cell is one day's checklist completion. Darker cyan = more complete.</p>
                    <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
                      {last30.map((dk) => {
                        const rec = dk === todayKey() ? { checked, total: dailyChecklist.length } : dailyHistory[dk];
                        const pct = rec ? rec.checked.filter(Boolean).length / rec.total : 0;
                        const isToday = dk === todayKey();
                        return (
                          <div
                            key={dk}
                            title={`${dk} · ${Math.round(pct * 100)}%`}
                            className="aspect-square rounded-sm"
                            style={{
                              background: pct === 0 ? C.surface2 : `${C.cyan}${Math.max(20, Math.round(pct * 99)).toString(16).padStart(2, "0")}`,
                              border: isToday ? `1.5px solid ${C.amber}` : `1px solid ${C.border}`,
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px]" style={{ color: C.dim }}>Less</span>
                      {[0.1, 0.3, 0.5, 0.7, 1].map((p) => (
                        <div key={p} className="w-3 h-3 rounded-sm" style={{ background: `${C.cyan}${Math.round(p * 99).toString(16).padStart(2, "0")}` }} />
                      ))}
                      <span className="text-[10px]" style={{ color: C.dim }}>More</span>
                      <span className="text-[10px] ml-2 flex items-center gap-1" style={{ color: C.amber }}>
                        <span style={{ width: 8, height: 8, border: `1.5px solid ${C.amber}`, display: "inline-block", borderRadius: 2 }} /> today
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <h3 className="mono-font font-bold text-sm mb-1" style={{ color: C.amber }}>Subject mastery board</h3>
                    <p className="text-xs mb-4" style={{ color: C.dim }}>Tap a subject to cycle its status — saved automatically.</p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {subjects.map((s) => {
                        const status = subjectStatus[s.id] || "not-started";
                        const meta = MASTERY_META[status];
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.id}
                            onClick={() => cycleMastery(s.id)}
                            className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-md text-left"
                            style={{ background: C.surface2, border: `1px solid ${meta.color}33` }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon size={15} color={C.dim} className="shrink-0" />
                              <span className="text-sm truncate" style={{ color: C.text }}>{s.name}</span>
                            </div>
                            <span
                              className="text-[10px] font-bold mono-font px-2 py-1 rounded shrink-0 flex items-center gap-1.5"
                              style={{ color: meta.color, background: `${meta.color}14`, border: `1px solid ${meta.color}40` }}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: 999, background: meta.color, display: "inline-block" }} />
                              {meta.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        <footer className="max-w-6xl mx-auto px-4 md:px-6 py-8" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-xs leading-relaxed" style={{ color: C.dim }}>
            Strategic framework based on documented GATE ECE patterns across the last two decades and proven topper
            methodologies. Weightages are trend indicators, not guarantees — cross-check the official GATE 2027
            syllabus once IIT Madras releases the notification (expected Jul–Aug 2026).
          </p>
        </footer>
      </div>
    </div>
  );
}
