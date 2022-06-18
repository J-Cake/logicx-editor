export enum Action {
    Document_Create,
    Document_Rename,
    Document_Delete,

    Document_Read,
    Document_Write,

    Document_Collaborator_Add,
    Document_Collaborator_Remove,
    Document_Collaborator_Leave,
    Document_Collaborator_CanEdit,

    Document_Component_Add,
    Document_Component_Remove,

    User_SignIn,
    User_Register,
    User_Change_Email,
    User_Change_Password,
    User_Change_Identifier,
    User_List_Own_Documents,
    User_List_Member_Documents,
    User_Get_Preferences,
    User_Change_Preferences,

    Component_Make,
    Component_Delete,
    Component_Get,
    Component_Find,

    App_SearchUsers,
    Script_Get,
}

export enum Status {
    Done,
    No_Change,
    Undefined,

    Bad_Data,
    Not_Authenticated,
    Insufficient_Access,
    Document_Exists,
    Document_Not_Exists,
    User_Exists,
    User_Not_Exists,
    User_Not_Member,
    Component_Exists,
    Component_Not_Exists,
    Component_Not_Member,

    Password_Invalid,
    Email_Not_Exists,
    Email_Exists,
    Identifier_Exists,
    Identifier_Not_Exists,
}

const statusDetails: Record<Status, [number, string]> = {
    [Status.Done]: [200, 'The operation was completed successfully.'],
    [Status.No_Change]: [304, 'The operation left no change behind.'],
    [Status.Undefined]: [200, 'The status of the operation is unknown.'],

    [Status.Bad_Data]: [400, 'The data provided is malformed.'],
    [Status.Not_Authenticated]: [401, 'The action was not performed, as the user requesting to do so was not authenticated.'],
    [Status.Insufficient_Access]: [403, 'The operation was denied for the given user.'],
    [Status.Document_Exists]: [409, 'The given  document already exists.'],
    [Status.Document_Not_Exists]: [404, 'The given  document does not exist.'],
    [Status.User_Exists]: [409, 'The given  user already exists.'],
    [Status.User_Not_Exists]: [404, 'The given  user does not exist.'],
    [Status.User_Not_Member]: [404, 'The given  user is not listed.'],
    [Status.Component_Exists]: [409, 'The given  component already exists.'],
    [Status.Component_Not_Exists]: [404, 'The given  component does not exist.'],
    [Status.Component_Not_Member]: [404, 'The given  component is not listed.'],

    [Status.Password_Invalid]: [400, 'The password is invalid'],
    [Status.Email_Exists]: [409, 'The given email address is already in use.'],
    [Status.Email_Not_Exists]: [404, 'The given email address does not exist.'],
    [Status.Identifier_Exists]: [409, 'The given identifier is already in use.'],
    [Status.Identifier_Not_Exists]: [404, 'The given identifier does not exist.'],
};

/**
 * Here is a map of all the different actions status types. These indicate whether an action succeeded or what went wrong if it didn't.
 */

type StatusMap<T extends Action> = (
    T extends Action.Document_Create ? Status.Done | Status.Not_Authenticated | Status.Document_Exists :
    T extends Action.Document_Rename ? Status.Done | Status.Not_Authenticated | Status.Document_Not_Exists | Status.Document_Exists :
    T extends Action.Document_Delete ? Status.Done | Status.Not_Authenticated | Status.Insufficient_Access | Status.Document_Not_Exists :
    T extends Action.Document_Read ? Status.No_Change | Status.Not_Authenticated | Status.Document_Not_Exists :
    T extends Action.Document_Write ? Status.Done | Status.Not_Authenticated | Status.Document_Not_Exists | Status.Insufficient_Access | Status.Bad_Data :
    T extends Action.Document_Collaborator_Add ? Status.Done | Status.No_Change | Status.Not_Authenticated | Status.Document_Not_Exists | Status.Insufficient_Access | Status.User_Not_Exists :
    T extends Action.Document_Collaborator_Remove ? Status.Done | Status.Not_Authenticated | Status.Document_Not_Exists | Status.Insufficient_Access | Status.User_Not_Member :
    T extends Action.Document_Collaborator_Leave ? Status.Done | Status.Not_Authenticated | Status.Document_Not_Exists | Status.User_Not_Member :
    T extends Action.Document_Collaborator_CanEdit ? Status.Done | Status.Not_Authenticated | Status.Document_Not_Exists | Status.User_Not_Member :
    T extends Action.Document_Component_Add ? Status.Done | Status.Not_Authenticated | Status.No_Change | Status.Document_Not_Exists | Status.Component_Not_Exists | Status.Component_Exists | Status.Insufficient_Access :
    T extends Action.Document_Component_Remove ? Status.Done | Status.No_Change | Status.Not_Authenticated | Status.Document_Not_Exists | Status.Component_Not_Member | Status.Insufficient_Access :
    T extends Action.User_SignIn ? Status.No_Change | Status.Email_Not_Exists | Status.Identifier_Not_Exists | Status.Password_Invalid :
    T extends Action.User_Register ? Status.Done | Status.Email_Exists | Status.Identifier_Exists | Status.Password_Invalid :
    T extends Action.User_Change_Email ? Status.Done | Status.Not_Authenticated | Status.Email_Exists :
    T extends Action.User_Change_Password ? Status.Done | Status.Not_Authenticated :
    T extends Action.User_Change_Identifier ? Status.Done | Status.Not_Authenticated | Status.Identifier_Exists :
    T extends Action.User_List_Own_Documents ? Status.Done | Status.Not_Authenticated :
    T extends Action.User_List_Member_Documents ? Status.Done | Status.Not_Authenticated :
    T extends Action.User_Get_Preferences ? Status.No_Change | Status.Not_Authenticated :
    T extends Action.User_Change_Preferences ? Status.Done | Status.Not_Authenticated :
    T extends Action.Component_Make ? Status.Done | Status.Not_Authenticated | Status.Component_Exists | Status.Bad_Data :
    T extends Action.Component_Delete ? Status.Done | Status.Not_Authenticated | Status.Component_Not_Exists :
    T extends Action.Component_Get ? Status.No_Change | Status.Component_Not_Exists | Status.Insufficient_Access :
    T extends Action.Component_Find ? Status.No_Change :
    T extends Action.App_SearchUsers ? Status.No_Change :
    T extends Action.Script_Get ? Status.No_Change | Status.Component_Not_Exists :
    Status.No_Change)
    | Status.Undefined;

export type ApiResponse<Data, A extends Action> = ApiResponse_Success<Data, A> | ApiResponse_Failure<Data, A>;
export type ApiResponse_Success<Data, A extends Action> = {
    action: A,
    data: Data,
    status: StatusMap<A>,
};
export type ApiResponse_Failure<Data, A extends Action> = {
    action: A,
    error: string,
    status: StatusMap<A>,
}