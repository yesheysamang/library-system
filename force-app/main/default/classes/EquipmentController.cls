public with sharing class EquipmentController {
    static Integer PAGE_SIZE = 5;

    public class Filters {
        public String searchKey { get;set; }

        public String[] types { get;set; }

        public String[] status { get;set; }
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getEquipment(String filters, Integer pageNumber) {
        String key, whereClause = '';
        String[] types, status, criteria = new String[]{};
        if (!String.isEmpty(filters)) {
            Filters equipmentFilters = (Filters) JSON.deserializeStrict(filters, EquipmentController.Filters.class);
            status = equipmentFilters.status;
            if (!String.isEmpty(equipmentFilters.searchKey)) {
                key = '%' + equipmentFilters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (equipmentFilters.types != null) {
                types = equipmentFilters.types;
                criteria.add('Equipment_Type__c IN :types');
            }                      
            if (equipmentFilters.status != null) {
                status = equipmentFilters.status;
                criteria.add('Equipment_Status__c IN :status');
            }                      
            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join( criteria, ' AND ' );
            }                      
        }
        Integer pageSize = EquipmentController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result =  new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery('SELECT count() FROM Audio_Visual_Equipment__c ' + whereClause);
        result.records = Database.query('SELECT Id, Name, LastModifiedById, Equipment_Type__c, Equipment_Status__c, Picture_URL__c, Date_Last_Borrowed__c, Equipment_Id__c FROM Audio_Visual_Equipment__c ' + whereClause + ' ORDER BY Name LIMIT :pageSize OFFSET :offset');
        return result;
    }
}