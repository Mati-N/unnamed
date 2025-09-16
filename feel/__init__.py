import collections

# Maintain compatibility with libraries that still reference moved aliases in
# Python 3.10+ where they live in collections.abc.
for name in ("Mapping", "MutableMapping", "Sequence", "Iterable"):
    if not hasattr(collections, name):
        setattr(collections, name, getattr(collections.abc, name))
