import toast from 'react-hot-toast';
import { getStationsApi } from '../../../services/stationService';
import { FETCH_STATIONS_FAILURE, FETCH_STATIONS_REQUEST, FETCH_STATIONS_SUCCESS } from '../StationTypes';

export const fetchStationsAction = (showLoading = true) => async (dispatch) => {
  if (showLoading) {
    dispatch({ type: FETCH_STATIONS_REQUEST });
  }

  try {
    const res = await getStationsApi();

    const formattedData = (res.data || []).map(st => ({
      id: st.station_id,
      mst: st.mst || st.station_id.split('_')[0],
      hostname: st.hostname || st.station_id.split('_')[1],
      status: st.is_online ? 'online' : 'offline',
      lastActive: st.last_active || 'Không xác định'
    }));

    dispatch({
      type: FETCH_STATIONS_SUCCESS,
      payload: formattedData,
    });

  } catch (error) {
    dispatch({
      type: FETCH_STATIONS_FAILURE,
      payload: 'Lỗi khi tải danh sách trạm!',
    });
    if (showLoading) {
      toast.error('Không thể tải danh sách trạm!');
    }
  }
};
