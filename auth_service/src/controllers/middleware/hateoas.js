

export const hateoas = (_links, self, exclude) => {
  if (!_links) {
    throw new Error("HATEOAS _links are required");
  }
  return (req, res, next) => {
    const useHateoas = req.query.discover === "true";
    if (!useHateoas) return next();

    const linksArray = [];
    for (const key in _links) {
      if (exclude && exclude.includes(_links[key])) continue;
      const rel = self === _links[key] ? "self" : _links[key].rel;
      const href = `${req.protocol}://${req.get("host")}${_links[key].href}`;
      const method = _links[key].method;
      const link = { rel, href, method };
      linksArray.push(link);
    }
    
    req._links = linksArray;
    next();
  };
};
