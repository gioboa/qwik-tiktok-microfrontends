/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import { Cropper as ReactCropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

export const Cropper = qwikify$(
  (props) => {
    return (
      <div>
        <ReactCropper
          stencilProps={{ aspectRatio: 1 }}
          className="h-[400px]"
          onChange={(cropper) => props.onChange(cropper.getCoordinates())}
          src={props.src}
        />
      </div>
    );
  },
  { eagerness: 'visible' },
);
