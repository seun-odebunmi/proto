import * as Yup from 'yup';

function equalTo(ref, msg) {
  return Yup.mixed().test({
    name: 'equalTo',
    exclusive: false,
    message: msg || `Must be the same as ${ref.path}`,
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}
Yup.addMethod(Yup.string, 'equalTo', equalTo);

export default (formFields) =>
  Yup.object().shape(
    formFields.reduce((accum, { name, label, required, equalto }) => {
      return required
        ? {
            ...accum,
            [name]: equalto
              ? Yup.string().equalTo(Yup.ref(equalto), null).required(`${label} is required!`)
              : Yup.string().required(`${label} is required!`),
          }
        : { ...accum };
    }, {})
  );
