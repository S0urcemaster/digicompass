import { ViewPanel } from '../components/ViewPanel';
import { useCompassStore } from '../store/CompassStore';

export const CollectionView = () => {
  const {
    state: {
      data: { collection },
    },
  } = useCompassStore();

  return (
    <ViewPanel
      text="The collection already respects the product rule that higher-level objects are built only from collected items."
      title="Collection"
    >
      <div className="stats-grid">
        <div className="stat-tile">
          <strong>{collection.foci.length}</strong>
          <span>Collected foci</span>
        </div>
        <div className="stat-tile">
          <strong>{collection.mindsets.length}</strong>
          <span>Collected mindsets</span>
        </div>
      </div>
    </ViewPanel>
  );
};
