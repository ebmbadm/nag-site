/* @ds-bundle: {"format":4,"namespace":"Nag","components":[{"name":"Button"},{"name":"ToggleButton"},{"name":"Field"},{"name":"Select"},{"name":"Checkbox"},{"name":"Switch"},{"name":"Segmented"},{"name":"Tabs"},{"name":"Breadcrumb"},{"name":"Section"},{"name":"ProductRow"},{"name":"SpecTable"},{"name":"Status"},{"name":"Tag"},{"name":"Notice"},{"name":"ParamCell"},{"name":"Meter"},{"name":"Icon"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(' ');
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) out[k] = obj[k];
    return out;
  }
  var uid = 0;
  function useId(given) {
    var ref = React.useRef(null);
    if (ref.current === null) ref.current = given || 'nag-' + (++uid);
    return ref.current;
  }

  // Lucide icons (stroke 1.75). A string is a path, {c:[cx,cy,r]} a circle.
  var PATHS = {
    'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
    'chevron-down': ['m6 9 6 6 6-6'],
    'download': ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3'],
    'file-text': ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M16 13H8', 'M16 17H8'],
    'search': [{ c: [11, 11, 8] }, 'm21 21-4.3-4.3'],
    'wifi': ['M12 20h.01', 'M2 8.82a15 15 0 0 1 20 0', 'M5 12.86a10 10 0 0 1 14 0', 'M8.5 16.43a5 5 0 0 1 7 0'],
    'check': ['M20 6 9 17l-5-5'],
    'x': ['M18 6 6 18', 'm6 6 12 12'],
    'info': [{ c: [12, 12, 10] }, 'M12 16v-4', 'M12 8h.01'],
    'triangle-alert': ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3', 'M12 9v4', 'M12 17h.01'],
    'circle-x': [{ c: [12, 12, 10] }, 'm15 9-6 6', 'm9 9 6 6'],
    'scissors': [{ c: [6, 6, 3] }, { c: [6, 18, 3] }, 'M20 4 8.12 15.88', 'M14.47 14.48 20 20', 'M8.12 8.12 12 12'],
    'plus': ['M5 12h14', 'M12 5v14'],
    'minus': ['M5 12h14'],
    'phone': ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z']
  };

  function Icon(props) {
    var size = props.size || 20;
    var parts = PATHS[props.name] || [];
    var a11y = props.label ? { role: 'img', 'aria-label': props.label } : { 'aria-hidden': 'true' };
    return h('svg', Object.assign({
      className: cx('nag-icon', props.className), width: size, height: size, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round'
    }, a11y), parts.map(function (p, i) {
      return typeof p === 'string' ? h('path', { key: i, d: p }) : h('circle', { key: i, cx: p.c[0], cy: p.c[1], r: p.c[2] });
    }));
  }

  function Button(props) {
    var variant = props.variant || 'secondary';
    var size = props.size || 'lg';
    var iconSize = size === 'sm' ? 16 : 20;
    var rest = omit(props, ['variant', 'size', 'icon', 'iconAfter', 'children', 'className']);
    var tag = props.href ? 'a' : 'button';
    if (!props.href && rest.type === undefined) rest.type = 'button';
    return h(tag, Object.assign(rest, { className: cx('nag-btn', 'nag-btn--' + variant, 'nag-btn--' + size, props.className) }),
      props.icon ? h(Icon, { name: props.icon, size: iconSize }) : null,
      props.children,
      props.iconAfter ? h(Icon, { name: props.iconAfter, size: iconSize }) : null);
  }

  function ToggleButton(props) {
    var tone = props.tone || 'ink';
    var rest = omit(props, ['pressed', 'tone', 'label', 'children', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      'aria-pressed': props.pressed ? 'true' : 'false', 'aria-label': props.label,
      className: cx('nag-toggle', 'nag-toggle--' + tone, props.pressed && 'is-on', props.className)
    }), props.children);
  }

  function Field(props) {
    var id = useId(props.id);
    var size = props.size || 'lg';
    var noteId = id + '-note';
    var rest = omit(props, ['id', 'label', 'help', 'error', 'multiline', 'rows', 'size', 'className']);
    var control = h(props.multiline ? 'textarea' : 'input', Object.assign({ id: id, className: 'nag-input' },
      props.multiline ? { rows: props.rows || 3 } : {}, rest, {
        'aria-invalid': props.error ? 'true' : undefined,
        'aria-describedby': (props.error || props.help) ? noteId : undefined
      }));
    return h('div', { className: cx('nag-field', 'nag-field--' + size, props.className) },
      h('label', { className: 'nag-field__label', htmlFor: id }, props.label),
      control,
      props.error ? h('span', { id: noteId, className: 'nag-field__error' }, props.error)
        : (props.help ? h('span', { id: noteId, className: 'nag-field__help' }, props.help) : null));
  }

  function Select(props) {
    var id = useId(props.id);
    var size = props.size || 'lg';
    var rest = omit(props, ['id', 'label', 'help', 'options', 'size', 'className']);
    return h('div', { className: cx('nag-field', 'nag-field--' + size, props.className) },
      h('label', { className: 'nag-field__label', htmlFor: id }, props.label),
      h('div', { className: 'nag-select' },
        h('select', Object.assign({ id: id, className: 'nag-input' }, rest),
          (props.options || []).map(function (o) {
            var opt = typeof o === 'string' ? { value: o, label: o } : o;
            return h('option', { key: opt.value, value: opt.value }, opt.label);
          })),
        h(Icon, { name: 'chevron-down', size: 16 })),
      props.help ? h('span', { className: 'nag-field__help' }, props.help) : null);
  }

  function Checkbox(props) {
    var rest = omit(props, ['label', 'className']);
    return h('label', { className: cx('nag-check', props.className) },
      h('input', Object.assign({ type: 'checkbox' }, rest)), h('span', null, props.label));
  }

  function Switch(props) {
    var _s = React.useState(!!props.defaultChecked);
    var controlled = props.checked !== undefined;
    var on = controlled ? props.checked : _s[0];
    return h('button', {
      type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false', className: cx('nag-switch-row', props.className),
      onClick: function () { if (!controlled) _s[1](!on); if (props.onChange) props.onChange(!on); }
    }, h('span', { className: 'nag-switch', 'aria-hidden': 'true' }), h('span', null, props.label));
  }

  function Segmented(props) {
    var labelId = useId();
    var _s = React.useState(props.defaultValue !== undefined ? props.defaultValue : (props.options && props.options[0] && props.options[0].value));
    var controlled = props.value !== undefined;
    var value = controlled ? props.value : _s[0];
    return h('div', { className: cx('nag-seg', props.size === 'sm' && 'nag-seg--sm', props.className) },
      props.label ? h('span', { id: labelId, className: 'nag-seg__label' }, props.label) : null,
      h('div', { role: 'group', 'aria-labelledby': props.label ? labelId : undefined, 'aria-label': props.label ? undefined : props.ariaLabel, className: 'nag-seg__track' },
        (props.options || []).map(function (o) {
          return h('button', {
            key: String(o.value), type: 'button', className: 'nag-seg__opt', 'aria-pressed': o.value === value ? 'true' : 'false',
            onClick: function () { if (!controlled) _s[1](o.value); if (props.onChange) props.onChange(o.value); }
          }, o.label);
        })));
  }

  function Tabs(props) {
    return h('nav', { 'aria-label': props.label || 'Разделы', className: cx('nag-tabs', props.density === 'app' && 'nag-tabs--app', props.className) },
      (props.items || []).map(function (it, i) {
        return h('a', { key: i, href: it.href || '#', className: 'nag-tab', 'aria-current': it.current ? 'page' : undefined, onClick: it.onClick }, it.label);
      }));
  }

  function Breadcrumb(props) {
    var items = props.items || [];
    var out = [];
    items.forEach(function (it, i) {
      if (i) out.push(h('span', { key: 's' + i, 'aria-hidden': 'true' }, '/'));
      out.push(it.href && i < items.length - 1 ? h('a', { key: i, href: it.href }, it.label) : h('span', { key: i, 'aria-current': i === items.length - 1 ? 'page' : undefined }, it.label));
    });
    return h('nav', { 'aria-label': 'Хлебные крошки', className: cx('nag-crumbs', props.className) }, out);
  }

  function Section(props) {
    return h('section', { id: props.id, className: cx('nag-section', props.className) },
      h('div', { className: 'nag-section__head' },
        h('h2', { className: 'nag-section__title' }, props.title),
        props.description ? h('p', { className: 'nag-section__desc' }, props.description) : null,
        props.aside || null),
      h('div', { className: 'nag-section__body' }, props.children));
  }

  function ProductRow(props) {
    var request = props.price === undefined || props.price === null;
    return h('a', { href: props.href || '#', className: cx('nag-prow', props.className) },
      props.image ? h('span', { className: cx('nag-prow__photo', props.boxed && 'nag-prow__photo--box') },
        h('img', { src: props.image, alt: props.imageAlt || '' })) : null,
      h('span', { className: 'nag-prow__text' },
        h('h3', { className: 'nag-prow__name' }, props.name),
        props.summary ? h('p', { className: 'nag-prow__summary' }, props.summary) : null,
        props.spec ? h('p', { className: 'nag-prow__spec' }, props.spec) : null),
      h('p', { className: cx('nag-prow__price', request && 'nag-prow__price--request') },
        request ? 'По запросу' : props.price,
        props.priceNote ? h('small', null, props.priceNote) : null));
  }

  function SpecTable(props) {
    var density = props.density || 'site';
    function table(caption, rows, key) {
      return h('table', { key: key, className: cx('nag-spec', 'nag-spec--' + density) },
        caption ? h('caption', null, caption) : null,
        h('tbody', null, (rows || []).map(function (r, i) {
          return h('tr', { key: i }, h('th', { scope: 'row' }, r.label), h('td', null, r.value));
        })));
    }
    if (props.groups) {
      return h('div', { className: cx('nag-spec-groups', props.className) },
        props.groups.map(function (g, i) { return table(g.title, g.rows, i); }));
    }
    return table(props.caption, props.rows, 0);
  }

  function Status(props) {
    var tone = props.tone || 'ok';
    return h('span', { className: cx('nag-status', 'nag-status--' + tone, props.size === 'sm' && 'nag-status--sm', props.className) },
      h('span', { className: 'nag-status__dot', 'aria-hidden': 'true' }), props.children);
  }

  function Tag(props) {
    return h('span', { className: cx('nag-tag', props.className) }, props.children);
  }

  var NOTICE_ICON = { info: 'info', warn: 'triangle-alert', error: 'circle-x' };
  function Notice(props) {
    var tone = props.tone || 'info';
    return h('div', { role: tone === 'error' ? 'alert' : 'note', className: cx('nag-notice', 'nag-notice--' + tone, props.className) },
      h(Icon, { name: NOTICE_ICON[tone], size: props.size === 'sm' ? 18 : 20 }),
      h('p', null, props.title ? h('strong', null, props.title) : null, props.title ? ' ' : null, props.children));
  }

  function ParamCell(props) {
    var rest = omit(props, ['selected', 'off', 'children', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      'aria-pressed': props.selected ? 'true' : 'false',
      className: cx('nag-cell', props.off && !props.selected && 'is-off', props.selected && 'is-selected', props.className)
    }), props.children);
  }

  function Meter(props) {
    var level = typeof props.level === 'number' ? props.level : -90;
    var width = props.width || 72;
    var muted = !!props.muted;
    var tone = level > -3 ? 'clip' : (level > -10 ? 'warn' : 'ok');
    var pct = muted ? 0 : Math.max(0, Math.min(1, (level + 60) / 60));
    var sign = level < 0 ? '−' : (level > 0 ? '+' : '');
    var text = muted ? 'без звука' : (tone === 'clip' ? 'перегрузка' : (level <= -60 ? '—' : sign + Math.abs(Math.round(level)) + ' дБ'));
    return h('span', { className: cx('nag-meter', 'nag-meter--' + tone, props.className) },
      h('span', { className: 'nag-meter__track', style: { width: width + 'px' }, 'aria-hidden': 'true' },
        h('span', { className: 'nag-meter__fill', style: { width: Math.round(pct * width) + 'px' } })),
      props.showValue === false ? null : h('span', { className: 'nag-meter__value' }, text));
  }

  window.Nag = Object.assign(window.Nag || {}, {
    Button: Button, ToggleButton: ToggleButton, Field: Field, Select: Select, Checkbox: Checkbox, Switch: Switch,
    Segmented: Segmented, Tabs: Tabs, Breadcrumb: Breadcrumb, Section: Section, ProductRow: ProductRow,
    SpecTable: SpecTable, Status: Status, Tag: Tag, Notice: Notice, ParamCell: ParamCell, Meter: Meter, Icon: Icon
  });
})();
