import {Get} from "./api";

export const initMenu = (router, store) => {
	if (store.state.routes.length > 0) {
		return;
	}
	Get("/api/system/menus").then(data => {
		if (data) {
			let fmtRoutes = formatRoutes(data);
			router.addRoutes(fmtRoutes);
			store.commit('initRoutes', fmtRoutes);
			store.dispatch('connect');
		}
	})
}
export const formatRoutes = (routes) => {
	let fmRoutes = [];
	routes.forEach(router => {
		let {
			path,
			component,
			name,
			iconClass,
			children
		} = router;
		if (children && children instanceof Array) {
			children = formatRoutes(children);
		}
		let fmRouter = {
			path: path,
			name: name,
			iconClass: iconClass,
			children: children,
			component(resolve) {
				if (component.startsWith("Home")) {
					require(['../pages/' + component + '.vue'], resolve);
				} else if (component.startsWith("staff")) {
					require(['../pages/staff/' + component + '.vue'], resolve);
				} else if (component.startsWith("sys")) {
					require(['../pages/system/' + component + '.vue'], resolve);
				}
				if (component.startsWith("salary")) {
					require(['../pages/salary/' + component + '.vue'], resolve);
				}
			}
		}
		fmRoutes.push(fmRouter);
	})
	return fmRoutes;
}