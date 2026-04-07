import toast from 'react-hot-toast';
import { getStationsApi } from '../../../services/stationService';
import { FETCH_STATIONS_FAILURE, FETCH_STATIONS_REQUEST, FETCH_STATIONS_SUCCESS } from '../StationTypes';

export const fetchStationsAction = (showLoading = true) => async (dispatch) => {
  if (showLoading) {
    dispatch({ type: FETCH_STATIONS_REQUEST });
  }

  try {
    const res = await getStationsApi();

    const formattedData = (res.data || res.data?.data || []).map(st => ({
      id: st.station_id || st.Station_id,
      mst: st.mst || st.MST || (st.station_id || st.Station_id).split('_')[0],
      companyName: st.company_name || st.Company_Name || 'Chưa cập nhật',
      phone: st.phone || st.Phone || 'Chưa cập nhật',
      zaloGroup: st.zalo_group || st.Zalo_Group || '',
      hostname: st.hostname || st.Hostname || (st.station_id || st.Station_id).split('_')[1],
      status: st.is_online || st.Is_Online ? 'online' : 'offline',
      lastActive: st.last_active || st.Last_Active || 'Không xác định'
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
