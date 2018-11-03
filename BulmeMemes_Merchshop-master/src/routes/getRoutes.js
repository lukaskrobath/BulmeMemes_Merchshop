"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let getRouteMethods = function(route){
    let methods = [];
    for (let method in route.methods){
        if (method === "_all") continue;
        methods.push(method.toUpperCase());
    }
    return methods;
};

let hasParams = function(value){
    let regExp = /\(\?:\(\[\^\\\/]\+\?\)\)/g;
    return regExp.test(value);
};

let getRoutes = function(app, path = [], endpoints = []){
    let regExp = /^\/\^\\\/(?:(:?[\w\\.-]*(?:\\\/:?[\w\\.-]*)*)|(\(\?:\(\[\^\\\/]\+\?\)\)))\\\/.*/;
    let stack = app.stack || (app._router && app._router.stack);

    stack.forEach(function(val){
        if (val.route){
            endpoints.push({
                path: path + (path && val.route.path === "/" ? "" : val.route.path),
                methods: getRouteMethods(val.route)
            });
        }
        else if (val.name === "router" || val.name === "bound dispatch"){
            let newPath = regExp.exec(val.regexp);

            if (newPath){
                let parsedRegexp = val.regexp;
                let keyIndex = 0;
                let parsedPath;

                while (hasParams(parsedRegexp)){
                    parsedRegexp = parsedRegexp.toString().replace(/\(\?:\(\[\^\\\/]\+\?\)\)/, ":" + val.keys[keyIndex].name);
                    keyIndex++;
                }

                if (parsedRegexp !== val.regexp) newPath = regExp.exec(parsedRegexp);

                parsedPath = newPath[1].replace(/\\\//g, "/");

                if (parsedPath === ":postId/sub-router") console.log(val);

                getRoutes(val.handle, path + "/" + parsedPath, endpoints);
            }
            else getRoutes(val.handle, path, endpoints);
        }
    });
    return endpoints;
};

module.exports = getRoutes;
