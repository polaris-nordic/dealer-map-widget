import React, {forwardRef, useId} from 'react';
import styles from './Item.module.sass'
import {classNames} from '~/lib/helpers';

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface ItemProps {
    id?: string
    /* Child node */
    children?: React.ReactNode;
}

const Item = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        id = useId(),
        children
    } = props

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const itemClasses = classNames(
        styles.Item
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <div className={itemClasses} id={id} ref={ref}>
            <div className={styles.Inner}>
                { children }
            </div>
        </div>
    )
})

export default Item
