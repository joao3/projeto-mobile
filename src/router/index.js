import { route } from 'quasar/wrappers';
import {
  createRouter, createMemoryHistory, createWebHistory, createWebHashHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  // eslint-disable-next-line no-unused-vars
  const scrollBehavior = (to, from, savedPosition) => {
    const scrollpos = savedPosition
          || to.meta?.scrollPos
          || { left: 0, top: 0 };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(scrollpos);
      }, 1500); // transition just before 600ms
    });
  };

  const Router = createRouter({
    scrollBehavior,
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    // eslint-disable-next-line no-unused-expressions
    from.meta?.scrollTop && (from.meta.scrollTop = window.scrollY);

    return next();
  });

  return Router;
});
