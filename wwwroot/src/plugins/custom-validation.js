import config from '../static/config'
export default {
    validation(model) {
        var field = Object.keys(Object.assign({}, model))
        var result = []
        for (var i = 0; i < field.length; i++) {
            var resdesc = config.ErrorDescription.validation(model[field[i]].rules)
            result[field[i]] = { desc: resdesc }
        }
        return result
    }
}
