import { FocusCard } from './FocusCard';
import { PreviewFocusButton } from './PreviewFocusButton';
import type { Focus } from '../domain/types';

interface CardBrowserProps {
  focus: Focus;
  previews: Focus[];
  onSelectPreview: (index: number) => void;
}

export const CardBrowser = ({ focus, previews, onSelectPreview }: CardBrowserProps) => (
  <section className="card-browser">
    <div className="card-browser-top">
      <div className="card-browser-selected">
        <FocusCard focus={focus} selected />
      </div>
      <div className="card-browser-grid">
        {previews.slice(0, 4).map((previewFocus, index) => (
          <PreviewFocusButton
            key={`${previewFocus.saying.id}-${previewFocus.image.id}-grid`}
            focus={previewFocus}
            onClick={() => onSelectPreview(index)}
          />
        ))}
      </div>
    </div>
    <div className="card-browser-bottom">
      {previews.slice(4, 8).map((previewFocus, index) => (
        <PreviewFocusButton
          key={`${previewFocus.saying.id}-${previewFocus.image.id}-row`}
          focus={previewFocus}
          onClick={() => onSelectPreview(index + 4)}
        />
      ))}
    </div>
  </section>
);
