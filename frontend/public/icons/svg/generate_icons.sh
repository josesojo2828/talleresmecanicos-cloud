#!/md/bash
DIR="/home/jsojo/Documentos/quanticarch/base_arquitecture/frontend/public/icons/svg"
mkdir -p "$DIR"

create_svg() {
  cat << SVG_EOF > "$DIR/$1"
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g-$2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe" />
      <stop offset="100%" stop-color="#4facfe" />
    </linearGradient>
    <filter id="glow-$2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  $3
</svg>
SVG_EOF
}

# Finance & Crypto
create_svg "fin-subscription.svg" "sub" '<rect x="3" y="4" width="18" height="16" rx="3" stroke="url(#g-sub)" stroke-width="1.5" fill="url(#g-sub)" fill-opacity="0.05"/><path d="M3 10h18" stroke="url(#g-sub)" stroke-width="1.5"/><path d="M7 15h2m4 0h4" stroke="url(#g-sub)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "fin-user-sub.svg" "usub" '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="url(#g-usub)" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="url(#g-usub)" stroke-width="1.5"/><path d="M19 8v6m-3-3h6" stroke="url(#g-usub)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "fin-wallet.svg" "wal" '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" stroke="url(#g-wal)" stroke-width="1.5" fill="url(#g-wal)" fill-opacity="0.05"/><circle cx="18" cy="15" r="1" fill="url(#g-wal)"/>'
create_svg "fin-transaction.svg" "tra" '<path d="M7 10l5 5 5-5m0-3l-5-5-5 5" stroke="url(#g-tra)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3v18" stroke="url(#g-tra)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "fin-crypto-wallet.svg" "cwal" '<rect x="3" y="5" width="18" height="14" rx="3" stroke="url(#g-cwal)" stroke-width="1.5" fill="url(#g-cwal)" fill-opacity="0.05"/><path d="M16 12h5v4h-5z" stroke="url(#g-cwal)" stroke-width="1.5"/><path d="M7 12l2-2 2 2-2 2z" stroke="url(#g-cwal)" stroke-width="1.5"/>'
create_svg "fin-crypto-payment.svg" "cpay" '<circle cx="12" cy="12" r="9" stroke="url(#g-cpay)" stroke-width="1.5" fill="url(#g-cpay)" fill-opacity="0.05"/><path d="M9 8h4a2 2 0 1 1 0 4H9m0 0h4a2 2 0 1 1 0 4H9m3-10v2m0 8v2" stroke="url(#g-cpay)" stroke-width="1.5" stroke-linecap="round"/>'

# System
create_svg "sys-upload.svg" "upl" '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7l-5-5-5 5m5-5v12" stroke="url(#g-upl)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
create_svg "sys-loader.svg" "lod" '<path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="url(#g-lod)" stroke-width="2" stroke-linecap="round"/>'
create_svg "sys-load-balancer.svg" "lb" '<rect x="9" y="3" width="6" height="4" rx="1" stroke="url(#g-lb)" stroke-width="1.5"/><rect x="3" y="17" width="6" height="4" rx="1" stroke="url(#g-lb)" stroke-width="1.5"/><rect x="15" y="17" width="6" height="4" rx="1" stroke="url(#g-lb)" stroke-width="1.5"/><path d="M12 7v5m0 0H6v5m6-5h6v5" stroke="url(#g-lb)" stroke-width="1.5" stroke-linecap="round"/>'

# Geo
create_svg "geo-region.svg" "reg" '<path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" stroke="url(#g-reg)" stroke-width="1.5" fill="url(#g-reg)" fill-opacity="0.05"/><circle cx="12" cy="10" r="3" stroke="url(#g-reg)" stroke-width="1.5"/>'
create_svg "geo-country.svg" "cnt" '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="url(#g-cnt)" stroke-width="1.5" fill="url(#g-cnt)" fill-opacity="0.05"/><path d="M4 22V3" stroke="url(#g-cnt)" stroke-width="1.5"/>'
create_svg "geo-state.svg" "stt" '<path d="M3 6h18M3 12h18M3 18h18" stroke="url(#g-stt)" stroke-width="1.5" stroke-linecap="round"/><path d="M7 2v20m10-20v20" stroke="url(#g-stt)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "geo-city.svg" "cty" '<path d="M3 21h18M5 21V7l8-4v18M13 21V11l6-2v12" stroke="url(#g-cty)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="url(#g-cty)" fill-opacity="0.05"/><path d="M8 9h2m-2 4h2m-2 4h2m8-4h2m-2 4h2" stroke="url(#g-cty)" stroke-width="1" stroke-linecap="round"/>'
create_svg "geo-currency.svg" "cur" '<circle cx="12" cy="12" r="9" stroke="url(#g-cur)" stroke-width="1.5" fill="url(#g-cur)" fill-opacity="0.05"/><path d="M12 7v10M9 9h6m-6 6h6" stroke="url(#g-cur)" stroke-width="1.5" stroke-linecap="round"/>'

# Identity
create_svg "user-address.svg" "adr" '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="url(#g-adr)" stroke-width="1.5" fill="url(#g-adr)" fill-opacity="0.05"/><path d="M9 22V12h6v10" stroke="url(#g-adr)" stroke-width="1.5"/>'
create_svg "user-session.svg" "ses" '<circle cx="12" cy="12" r="10" stroke="url(#g-ses)" stroke-width="1.5" fill="url(#g-ses)" fill-opacity="0.05"/><path d="M12 6v6l4 2" stroke="url(#g-ses)" stroke-width="1.5" stroke-linecap="round"/>'

# UI Actions
create_svg "ui-create.svg" "cre" '<circle cx="12" cy="12" r="10" stroke="url(#g-cre)" stroke-width="1.5"/><path d="M12 8v8m-4-4h8" stroke="url(#g-cre)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "ui-upload.svg" "uup" '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7l-5-5-5 5m5-5v12" stroke="url(#g-uup)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
create_svg "ui-delete.svg" "del" '<path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="url(#g-del)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
create_svg "ui-find.svg" "fnd" '<circle cx="11" cy="11" r="8" stroke="url(#g-fnd)" stroke-width="1.5" fill="url(#g-fnd)" fill-opacity="0.05"/><path d="M21 21l-4.35-4.35" stroke="url(#g-fnd)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "ui-search.svg" "sea" '<path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="url(#g-sea)" stroke-width="1.5" stroke-linecap="round"/>'
create_svg "ui-pagination.svg" "pgn" '<rect x="3" y="16" width="4" height="4" rx="1" stroke="url(#g-pgn)" stroke-width="1.5"/><rect x="10" y="16" width="4" height="4" rx="1" stroke="url(#g-pgn)" stroke-width="1.5"/><rect x="17" y="16" width="4" height="4" rx="1" stroke="url(#g-pgn)" stroke-width="1.5"/><path d="M3 8h18" stroke="url(#g-pgn)" stroke-width="1.5" stroke-linecap="round"/>'

# Navigation
create_svg "nav-arrow-left.svg" "nl" '<path d="M15 18l-6-6 6-6" stroke="url(#g-nl)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
create_svg "nav-arrow-right.svg" "nr" '<path d="M9 18l6-6-6-6" stroke="url(#g-nr)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
create_svg "nav-arrow-top.svg" "nt" '<path d="M18 15l-6-6-6 6" stroke="url(#g-nt)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
create_svg "nav-arrow-down.svg" "nd" '<path d="M6 9l6 6 6-6" stroke="url(#g-nd)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'

chmod +x generate_icons.sh
./generate_icons.sh
