export const routerAll = (router, models, bot) => {
  const routeImports = [require('./bot.js')];

  routeImports.forEach(routeImport => routeImport.default(router, models, bot));
};
