import React, {forwardRef, InputHTMLAttributes, useId} from 'react';
import styles from './TextField.module.sass'
import {classNames} from '~/lib/helpers'

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    name?: string
    defaultValue?: string
    type?: HTMLInputElement['type']
    showLabel?: boolean
    placeholder?: string
    helpText?: string
    required?: boolean
    disableEnter?: boolean
    className?: string
    onEnter?: (value: string) => void
    onValueChange?: (value: string) => void
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props: TextFieldProps, ref) => {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        label,
        name,
        defaultValue,
        type = 'text',
        showLabel = true,
        placeholder,
        helpText,
        required,
        disableEnter,
        className,
        onEnter,
        onValueChange,
        ...rest
    } = props

    const inputId = name || useId()

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onValueChange) {
            onValueChange(event.target.value)
        }
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!onEnter) return

        if (event.key === 'Enter') {
            onEnter(event.currentTarget.value)

            event.preventDefault();
        }
    }

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const textFieldClasses = classNames(
        styles.TextField,
        className
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    const inputProps: any = {
        autoComplete: 'off',
        ...rest
    }

    if (name) {
        inputProps['name'] = name
    }

    return (
        <div className={textFieldClasses}>
            { (label && showLabel) && (
                <label htmlFor={name} className={styles.Label}>{ label } { required && <span className={styles.Required}>*</span>}</label>
            )}
            <input
                type={type}
                id={inputId}
                ref={ref}
                value={defaultValue}
                className={styles.Input}
                placeholder={placeholder}
                required={required}
                onKeyDown={onKeyDown}
                onChange={handleValueChange}
                {...inputProps}
            />
            { helpText && (
                <p className={styles.HelpText} id={`${name}-description`}>
                    { helpText }
                </p>
            )}
        </div>
    )
})

export default TextField
