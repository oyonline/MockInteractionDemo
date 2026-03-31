const flattenValue = (value, target) => {
  if (!value) return;

  if (typeof value === 'string') {
    target.push(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenValue(item, target));
    return;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, enabled]) => {
      if (enabled) target.push(key);
    });
  }
};

export default function cn(...parts) {
  const classes = [];
  parts.forEach((part) => flattenValue(part, classes));
  return classes.join(' ');
}
