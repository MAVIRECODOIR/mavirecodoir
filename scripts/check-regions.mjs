const res = await fetch("https://api.mavirecodoir.com/store/regions?fields=*,*countries", {
  headers: { "x-publishable-api-key": "pk_5bd7f16fb67464fc999009ebba49fe66faf956988ca6054fc16a5044821a36b6" }
});
const { regions } = await res.json();
for (const r of regions) {
  console.log(`${r.name} (${r.currency_code}): ${r.countries?.map(c => c.iso_2).join(", ") || "none"}`);
}
