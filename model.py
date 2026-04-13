# AMKR v3 — Complete Financial Model
# Sum-of-Parts + Tariff Impact + ASE Precedent

print("=== AMKR v3 — Complete Financial Model ===\n")

# ── SEGMENT REVENUE ESTIMATES (FY2026E) ──────────────────
# Based on Q4 2025 segment mix + guided growth rates
BASE_REV_2026 = 7459  # consensus $M

# FY2025 Actual segment mix (from earnings):
# Computing: ~20% = $1,342M → guided >20% growth → $1,610M
# Communications: ~46% = $3,086M → stable smartphones → $3,200M
# Automotive/Industrial: ~19% = $1,275M → stable → $1,350M  
# Consumer: ~15% = $1,007M → declining → $800M
# Mainstream: all categories have mainstream portion

# Refined with growth guidance
SEGMENTS = {
    "Computing (AI/HPC)":    {"rev": 1490, "mult_base": 3.0, "mult_bull": 5.0, "rationale": "AI infrastructure multiple"},
    "Communications":         {"rev": 3380, "mult_base": 1.5, "mult_bull": 1.8, "rationale": "Premium smartphone, stable"},
    "Automotive/Industrial":  {"rev": 1390, "mult_base": 2.0, "mult_bull": 2.5, "rationale": "EV/ADAS secular tailwind"},
    "Consumer/Mainstream":    {"rev": 199,  "mult_base": 0.8, "mult_bull": 0.8, "rationale": "Commodity, declining"},
}
NET_DEBT = 187  # $M
SHARES = 247    # M shares
CURRENT_PRICE = 46.49

print("SUM-OF-PARTS VALUATION (FY2026E)")
print("-" * 85)
print(f"{'Segment':<28}{'Rev ($M)':>10}{'Base Mult':>10}{'Base Val':>10}{'Bull Mult':>10}{'Bull Val':>10}")
print("-" * 85)

total_base_ev = 0
total_bull_ev = 0
total_rev = 0

for seg, d in SEGMENTS.items():
    base_val = d["rev"] * d["mult_base"]
    bull_val = d["rev"] * d["mult_bull"]
    total_base_ev += base_val
    total_bull_ev += bull_val
    total_rev += d["rev"]
    print(f"{seg:<28}{d['rev']:>10,}{d['mult_base']:>10.1f}×{base_val:>10,.0f}{d['mult_bull']:>10.1f}×{bull_val:>10,.0f}")

print("-" * 85)
print(f"{'Total Enterprise Value':<28}{total_rev:>10,}{'':>10}{total_base_ev:>10,.0f}{'':>10}{total_bull_ev:>10,.0f}")

base_eq = total_base_ev - NET_DEBT
bull_eq = total_bull_ev - NET_DEBT
base_price = base_eq / SHARES
bull_price = bull_eq / SHARES
base_up = (base_price / CURRENT_PRICE - 1) * 100
bull_up = (bull_price / CURRENT_PRICE - 1) * 100

print(f"\n  Less Net Debt:              -${NET_DEBT}M")
print(f"  Base Equity Value:          ${base_eq:,.0f}M → ${base_price:.2f}/share ({base_up:+.1f}%)")
print(f"  Bull Equity Value:          ${bull_eq:,.0f}M → ${bull_price:.2f}/share ({bull_up:+.1f}%)")
print(f"  Blended Base P/S:           {total_base_ev/total_rev:.2f}×")

print("\n\n=== ASE RE-RATING PRECEDENT ===\n")
ase_data = {
    2018: 0.66, 2019: 0.86, 2020: 0.74, 2021: 0.81,
    2022: 0.62, 2023: 1.09, 2024: 1.23, 2025: 1.74
}
amkr_ps_today = 1.46
print(f"{'Year':<8}{'ASE P/S':>10}{'vs AMKR Today':>15}{'Phase'}")
print("-" * 55)
for yr, ps in ase_data.items():
    diff = ps - amkr_ps_today
    phase = ""
    if yr <= 2022: phase = "Trough (AMKR is here now)"
    elif yr == 2023: phase = "Re-rating begins"
    elif yr == 2024: phase = "Accelerating"
    elif yr == 2025: phase = "Re-rated as AI infra"
    print(f"{yr:<8}{ps:>10.2f}×{diff:>+15.2f}   {phase}")

trough_ps = 0.62
peak_ps = 1.74
expansion = (peak_ps / trough_ps - 1) * 100
amkr_at_ase_peak = BASE_REV_2026 * peak_ps / SHARES
print(f"\n  ASE multiple expansion: {trough_ps:.2f}× → {peak_ps:.2f}× = +{expansion:.0f}% in 3 years")
print(f"  If AMKR hits 1.74× (ASE parity): ${amkr_at_ase_peak:.2f}/share")
print(f"  If AMKR hits 2.0× (base case):   ${BASE_REV_2026*2.0/SHARES:.2f}/share")
print(f"  If AMKR hits 3.0× (bull case):   ${BASE_REV_2026*3.0/SHARES:.2f}/share")

print("\n\n=== TARIFF IMPACT QUANTIFICATION ===\n")
print("Tariff Winners vs Losers:")
print(f"  JCET (China OSAT) cost increase on US exports: +12-16%")
print(f"  At JCET rev of ~$4B and 30% US exposure: ~$150-200M cost headwind")
print(f"  AMKR Arizona production: EXEMPT (domestic US use)")
print(f"  AMKR CHIPS Act funding: $400M direct + $200M loans + 25% ITC on capex")
print(f"  Net capex benefit from 25% ITC on $2.75B capex: ~$688M")
print(f"  Total government support: ~$1.3B (funding + ITC) vs $2.75B capex = 47% offset")

print("\n\n=== FINAL PRICE TARGETS SUMMARY ===\n")
cases = [
    ("Bear", 7100, 1.20, "AI capex slowdown, packaging re-commoditizes"),
    ("Base", 7459, 2.00, "Consensus revenue, re-rates to ASE parity+"),
    ("Bull", 7800, 3.00, "Above-consensus + full AI infra re-rating"),
    ("SOTP Base", None, None, f"Sum-of-parts blended {total_base_ev/total_rev:.2f}× = ${base_price:.2f}"),
]
print(f"{'Case':<12}{'Revenue':>10}{'P/S':>8}{'Price':>10}{'Upside':>10}")
print("-" * 55)
for case, rev, ps, desc in cases:
    if rev and ps:
        price = rev * ps / SHARES
        upside = (price / CURRENT_PRICE - 1) * 100
        print(f"{case:<12}{rev:>10,}{ps:>8.1f}×${price:>9.2f}{upside:>+10.1f}%   {desc}")
    else:
        print(f"{case:<12}{'SOTP':>10}{'blended':>8}  ${base_price:>8.2f}{base_up:>+10.1f}%   {desc}")
