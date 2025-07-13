import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Team } from "../api/team";

export interface TeamState {
	teams: Team[];
	activeTeamId: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: TeamState = {
	teams: [],
	activeTeamId: null,
	loading: false,
	error: null,
};

const teamSlice = createSlice({
	name: "team",
	initialState,
	reducers: {
		setTeams: (state, action: PayloadAction<Team[]>) => {
			state.teams = action.payload;
			// If there's no active team, or the active team is no longer in the list, set the first team as active.
			if (
				action.payload.length > 0 &&
				(!state.activeTeamId ||
					!action.payload.some((t) => t.id === state.activeTeamId))
			) {
				const firstTeam = action.payload[0];
				if (firstTeam) {
					state.activeTeamId = firstTeam.id;
				}
			} else if (action.payload.length === 0) {
				state.activeTeamId = null;
			}
		},
		setActiveTeam: (state, action: PayloadAction<string>) => {
			state.activeTeamId = action.payload;
		},
		addTeam: (state, action: PayloadAction<Team>) => {
			state.teams.push(action.payload);
		},
	},
});

export const { setTeams, setActiveTeam, addTeam } = teamSlice.actions;
export default teamSlice.reducer;
