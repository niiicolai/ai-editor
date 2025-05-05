interface Link {
  rel: string;
  method: string;
  href: string;
}

interface LinksInput {
  [method: string]: Link;
}

export const hateoas = (
  _links: LinksInput,
  self: Link,
  exclude: Link[] = []
) => {
  if (!_links) {
    throw new Error("HATEOAS _links are required");
  }

  return (req: any, res: any, next: any) => {
    const useHateoas = req.query.discover === "true";
    if (!useHateoas) return next();

    const linksArray = [] as Link[];
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
