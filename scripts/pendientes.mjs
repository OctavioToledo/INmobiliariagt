#!/usr/bin/env node
// Lista todo lo que falta confirmar con el cliente:
// los "[A CONFIRMAR" del código y los campos "revisar" de cada propiedad.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const raiz = process.cwd();
const carpetas = ['src', 'public'];
const extensiones = /\.(astro|ts|mjs|js|json|css|md|svg)$/;
const marca = '[A CONFIRMAR';

async function* recorrer(dir) {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) yield* recorrer(ruta);
    else if (extensiones.test(entrada.name)) yield ruta;
  }
}

let total = 0;
console.log('\nPendientes en el código\n');
for (const carpeta of carpetas) {
  for await (const archivo of recorrer(join(raiz, carpeta))) {
    const lineas = (await readFile(archivo, 'utf8')).split('\n');
    lineas.forEach((linea, i) => {
      if (linea.includes(marca) && !linea.includes('@pendientes-ignorar')) {
        total += 1;
        console.log(`  ${relative(raiz, archivo)}:${i + 1}  ${linea.trim()}`);
      }
    });
  }
}

const propiedades = JSON.parse(await readFile(join(raiz, 'src/data/propiedades.json'), 'utf8'));
const conRevision = propiedades.filter((p) => p.revisar?.length);
if (conRevision.length) {
  console.log('\nDatos a revisar por propiedad\n');
  for (const p of conRevision) {
    total += p.revisar.length;
    console.log(`  ${p.codigo}  ${p.titulo}`);
    for (const r of p.revisar) console.log(`    - ${r}`);
  }
}
const sinFotos = [];
for (const p of propiedades) {
  const archivos = await readdir(join(raiz, 'src/assets/propiedades', String(p.codigo))).catch(() => []);
  if (!archivos.some((a) => /\.(jpe?g|png|webp|avif)$/i.test(a))) sinFotos.push(p);
}
if (sinFotos.length) {
  console.log('\nPropiedades sin fotos\n');
  for (const p of sinFotos) console.log(`  ${p.codigo}  ${p.titulo}`);
  total += sinFotos.length;
}

console.log(`\n${total} pendientes en total.\n`);
