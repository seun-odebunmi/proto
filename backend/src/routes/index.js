export const routerAll = (router, models, bot) => {
  const routeImports = [require('./bot.js'), require('./user.js')];

  routeImports.forEach((routeImport) => routeImport.default(router, models, bot));
};
