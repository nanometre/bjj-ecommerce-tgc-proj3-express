// =================================================
// =========== Import Form Dependencies ============
// =================================================
const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// =================================================
// ============ Bootstrap Field Helpers ============
// =================================================
var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// =================================================
// ================= Define Forms ==================
// =================================================
const createProductForm = (materials, weaves, categories, brands) => {
    return forms.create({
        product_name: fields.string({
            label: 'Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            }
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.textarea()
        }),
        cost: fields.string({
            label: 'Cost (SGD)',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)],
            cssClasses: {
                label: ['form-label', 'mt-3']
            }
        }),
        weight: fields.string({
            label: 'Weight (g)',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)],
            cssClasses: {
                label: ['form-label', 'mt-3']
            }
        }),
        material_id: fields.string({
            label: "Material",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.select(),
            choices: materials
        }),
        weave_id: fields.string({
            label: "Weave",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.select(),
            choices: weaves
        }),
        category_id: fields.string({
            label: "Category",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.select(),
            choices: categories
        }),
        brand_id: fields.string({
            label: "Brand",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.select(),
            choices: brands
        })
    })
}

const createVariantForm = (color, size, tags) => {
    return forms.create({
        color_id: fields.string({
            label: 'Color',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.select(),
            choices: color
        }),
        size_id: fields.string({
            label: 'Size',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.select(),
            choices: size
        }),
        tags: fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            },
            widget: widgets.multipleSelect(),
            choices: tags
        }),
        stock: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)],
            cssClasses: {
                label: ['form-label', 'mt-3']
            }
        })
    })
}

const createMaterialForm = () => {
    return forms.create({
        material_name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'mt-3']
            }
        })
    })
}

module.exports = { bootstrapField, createProductForm, createVariantForm, createMaterialForm }