export const routerAll = (router, models, bot) => {
  const routeImports = [
    require('./bot.js'),
    require('./user.js'),
    require('./medicalRecords.js'),
    require('./recommendation.js'),
  ];

  routeImports.forEach((routeImport) => routeImport.default(router, models, bot));
};
