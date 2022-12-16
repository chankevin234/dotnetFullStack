//an Entity/Model (thing you will store in a DB)

namespace Domain // folder name
{
    public class Activity
    {
        public Guid Id { get; set; } //primary key of the database for Entity Framework to recog. as a global unique id
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}