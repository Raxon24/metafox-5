/**
 * @type: formElement
 * name: form.element.CheckboxGroup
 */
import { FormFieldProps } from '@metafox/form';
import { styled, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import { useField } from 'formik';
import { camelCase } from 'lodash';
import React from 'react';

const Title = styled(Typography, {
  name: 'Title',
  shouldForwardProp: prop => prop !== 'styleGroup'
})<{ styleGroup?: string }>(({ theme, styleGroup }) => ({
  ...(styleGroup === 'question' && {
    color: theme.palette.text.secondary
  }),
  ...(styleGroup === 'normal' && {})
}));

const CheckboxGroupField = ({
  config,
  name,
  disabled: forceDisabled,
  formik
}: FormFieldProps) => {
  const [field, meta] = useField(name ?? 'CheckboxGroupField');
  const {
    label,
    options,
    variant,
    margin,
    fullWidth,
    size,
    disabled,
    hasFormOrder = false,
    order,
    styleGroup = 'normal'
  } = config;

  const value = field.value || [];

  const haveError: boolean = !!(
    meta.error &&
    (meta.touched || formik.submitCount)
  );

  const orderLabel = hasFormOrder && order ? `${order}. ` : null;

  return (
    <FormControl
      component="fieldset"
      fullWidth={fullWidth}
      margin={margin}
      size={size}
      error={haveError}
      variant={variant as any}
      data-testid={camelCase(`field ${name}`)}
    >
      <Title variant="h5" styleGroup={styleGroup}>
        {orderLabel}
        {label}
      </Title>
      <FormGroup>
        {options
          ? options.map((item, index) => (
              <FormControlLabel
                key={index.toString()}
                control={
                  <Checkbox
                    checked={value.includes(String(item.value))}
                    onChange={field.onChange}
                    name={name}
                    data-testid={camelCase(`input ${name}`)}
                    disabled={
                      item?.disabled ||
                      disabled ||
                      forceDisabled ||
                      formik.isSubmitting
                    }
                  />
                }
                label={item.label}
                value={item.value}
                disabled={
                  item?.disabled ||
                  disabled ||
                  forceDisabled ||
                  formik.isSubmitting
                }
              />
            ))
          : null}
      </FormGroup>
      {haveError ? <FormHelperText>{meta.error}</FormHelperText> : null}
    </FormControl>
  );
};

export default CheckboxGroupField;
