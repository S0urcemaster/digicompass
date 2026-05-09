import { CardBrowser } from '../components/CardBrowser';
import { MindsetPaginator } from '../components/MindsetPaginator';
import { useCompassStore } from '../store/CompassStore';

const getPreviewEntries = (selectedIndex: number, totalCount: number) =>
  Array.from({ length: totalCount }, (_, index) => index).filter(
    (index) => index !== selectedIndex,
  );

export const CompassView = () => {
  const { state, dispatch } = useCompassStore();
  const mindset = state.data.mindsets[state.selectedMindsetIndex];

  if (!mindset || mindset.foci.length === 0) {
    return <section className="empty-state">No focus available.</section>;
  }

  const activeFocus = mindset.foci[state.selectedFocusIndex] ?? mindset.foci[0];
  const previewIndices = getPreviewEntries(state.selectedFocusIndex, mindset.foci.length);
  const previewFoci = previewIndices.map((index) => mindset.foci[index]);

  return (
    <section className="compass-view">
      <MindsetPaginator
        mindsets={state.data.mindsets}
        onSelect={(index) => dispatch({ type: 'select-mindset', index })}
        selectedIndex={state.selectedMindsetIndex}
      />
      <CardBrowser
        focus={activeFocus}
        onSelectPreview={(previewIndex) =>
          dispatch({ type: 'select-focus', index: previewIndices[previewIndex] })
        }
        previews={previewFoci}
      />
      <label className="notes-panel">
        <span>Mindset Notes</span>
        <textarea
          onChange={(event) =>
            dispatch({ type: 'update-mindset-notes', notes: event.target.value })
          }
          rows={5}
          value={mindset.notes}
        />
      </label>
    </section>
  );
};
