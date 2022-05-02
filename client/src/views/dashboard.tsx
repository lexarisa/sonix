import { useSelector } from 'react-redux';

//! import components/views/styles
import RecipeScrollContainer from '../components/non-auth/recipe-scroll-container';
import './styles/dashboard.scss';

const Dashboard = () => {
  const dashboardRecipes = useSelector((state) => state.dashboardRecipes);

  return (
    <div className="dashboard-wrapper">
      {Object.keys(dashboardRecipes).map(
        (cat) =>
          dashboardRecipes[cat].length > 0 && (
            <RecipeScrollContainer
              title={cat}
              data={dashboardRecipes[cat]}
              key={cat}
            />
          )
      )}
    </div>
  );
};

export default Dashboard;
