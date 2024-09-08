import { api } from "./service/api.js";

window.app = {
  data: [],
  costEfficient: { unitPricePerUnit: "Infinity" },
  expensive: { unitPricePerUnit: "-Infinity" },
  ramOptions: [],
  coreOptions: [],
  form: undefined,
  mediumPrice: 0,
};

window.addEventListener("DOMContentLoaded", async () => {
  await retriveData();
  formSubmitOveright();
});
window.addEventListener("data-loaded", insertRamOptions);
window.addEventListener("data-loaded", insertCoreOptions);

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

function insertRamOptions() {
  const ramSelector = document.querySelector("#memoryInMB");
  if (ramSelector) {
    app.ramOptions
      .sort((a, b) => a - b)
      .forEach((e) => {
        ramSelector.innerHTML += `<option value="${e}">${e / 1024}GB</option>`;
      });
  }
}
function insertCoreOptions() {
  const coresSelector = document.querySelector("#numberOfCores");
  if (coresSelector) {
    app.coreOptions
      .sort((a, b) => a - b)
      .forEach((e) => {
        coresSelector.innerHTML += `<option value="${e}">${e}</option>`;
      });
  }
}
function formSubmitOveright() {
  const form = document.querySelector("#vm-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    app.form = data;
    window.dispatchEvent(new Event("form-submission"));
  });
}
