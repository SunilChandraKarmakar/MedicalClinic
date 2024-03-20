using AutoMapper;
using MedicalClinicWebApi.Model.Models;
using MedicalClinicWebApi.Model.ViewModels.User;

namespace MedicalClinicWebApi.AutomapperSetting
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            // User model map
            CreateMap<User, UserViewModel>()
                .ForMember(d => d.UserTypeName, s => s.MapFrom(m => m.UserType.Name));
            CreateMap<UserViewModel, User>();

            CreateMap<User, UserCreateViewModel>();
            CreateMap<UserCreateViewModel, User>();

            CreateMap<User, UserUpdateViewModel>();
            CreateMap<UserUpdateViewModel, User>();
        }
    }
}