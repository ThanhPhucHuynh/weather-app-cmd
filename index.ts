import { parse } from  "https://deno.land/std@0.61.0/flags/mod.ts";
import {
    fromUnixTime,
    format,
  } from "https://deno.land/x/date_fns@v2.15.0/index.js";
  import AsciiTable from "https://deno.land/x/ascii_table/mod.ts";
  import ProgressBar from "https://deno.land/x/progressbar@v0.2.0/progressbar.ts";
  import {
    percentageWidget,
    amountWidget,
  } from "https://deno.land/x/progressbar@v0.2.0/widgets.ts";
 

// import cliProgress from 'cli-progress';
const args = parse(Deno.args);
if (args.city === undefined) {
    console.error("No city supplied");
    Deno.exit();
}
const apiKey = '84343c9bee79a1c6936a854780911df1';

const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${args.city}&units=metric&appid=542ffd081e67f4512b705f89d2a611b2`);
const data = await res.json();

interface forecastItem {
    dt: string;
    main: { temp: number };
    weather: { description: string }[];
}

const forecast = data.list.slice(0, 8).map((item: forecastItem) => [
format(fromUnixTime(item.dt), "do LLL, k:mm", {}),
`${item.main.temp.toFixed(1)}C`,
item.weather[0].description,
]);

const table = AsciiTable.fromJSON({
title: `${data.city.name} Forecast`,
heading: ["Time", "Temp", "Weather"],
rows: forecast,
});

console.log(table.toString());
// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// const widgets = [percentageWidget, amountWidget];
// const pb = new ProgressBar({ total: 25, widgets });

// for (let i = 0; i < pb.total; i++) {
//     await pb.update(i);
//     await sleep(50);
// }
// await pb.finish();