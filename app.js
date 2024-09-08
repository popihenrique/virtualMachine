import { api } from "./service/api.js";

window.addEventListener("DOMContentLoaded", async () => {
  await retriveData();
});

async function retriveData() {
  app.data = await api.fetchData();
  app = app.data.reduce(
    (acc, curr) => {
      if (!!curr.unitPricePerUnit) {
        if (!acc.ramOptions.includes(curr.memoryInMB)) {
          acc.ramOptions.push(curr.memoryInMB);
        }
        if (!acc.coreOptions.includes(curr.numberOfCores)) {
          acc.coreOptions.push(curr.numberOfCores);
        }
        if (
          Number(acc.expensive.unitPricePerUnit.replaceAll(",", ".")) <
          Number(curr.unitPricePerUnit.replaceAll(",", "."))
        ) {
          acc.expensive = curr;
        }
        if (
          Number(acc.costEfficient.unitPricePerUnit.replaceAll(",", ".")) >
          Number(curr.unitPricePerUnit.replaceAll(",", "."))
        ) {
          acc.costEfficient = curr;
        }
        acc.mediumPrice +=
          Number(curr.unitPricePerUnit.replaceAll(",", ".")) / app.data.length;
      }
      return acc;
    },
    {
      data: app.data,
      costEfficient: { unitPricePerUnit: "Infinity" },
      expensive: { unitPricePerUnit: "-Infinity" },
      ramOptions: [],
      coreOptions: [],
      mediumPrice: 0,
    }
  );
  window.dispatchEvent(new Event("data-loaded"));
}
